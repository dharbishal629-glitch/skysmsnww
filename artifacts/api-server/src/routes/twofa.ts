import { Router, type IRouter, type Request, type Response } from "express";
import { pool } from "@workspace/db";
import { createHmac, randomBytes } from "crypto";
import QRCode from "qrcode";
import { ensure2FASchema } from "../lib/simSchema2fa.js";

const router: IRouter = Router();

// ── Base32 helpers ────────────────────────────────────────────────────────────
const B32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/** Encode a Buffer as a base32 string (no padding). */
function base32Encode(buf: Buffer): string {
  let bits = 0;
  let value = 0;
  let result = "";
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      result += B32_CHARS[(value >>> (bits - 5)) & 0x1f];
      bits -= 5;
    }
  }
  if (bits > 0) result += B32_CHARS[(value << (5 - bits)) & 0x1f];
  return result;
}

/** Generate a cryptographically random base32 TOTP secret. */
function generateTotpSecret(): string {
  return base32Encode(randomBytes(20)); // 20 bytes → 32-char base32
}

/** Build an otpauth:// URI for use in authenticator apps. */
function buildOtpAuthUri(label: string, issuer: string, secret: string): string {
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: "SHA1",
    digits: "6",
    period: "30",
  });
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(label)}?${params}`;
}

function base32Decode(encoded: string): Buffer {
  const clean = encoded.toUpperCase().replace(/=+$/, "");
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    const idx = B32_CHARS.indexOf(ch);
    if (idx < 0) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) { out.push((value >>> (bits - 8)) & 0xff); bits -= 8; }
  }
  return Buffer.from(out);
}

function totpToken(secret: string, step: number): string {
  const key = base32Decode(secret);
  const counter = Buffer.alloc(8);
  counter.writeUInt32BE(0, 0);
  counter.writeUInt32BE(step >>> 0, 4);
  const hmac = createHmac("sha1", key).update(counter).digest();
  const offset = hmac[19] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return (code % 1_000_000).toString().padStart(6, "0");
}

type TotpResult = { valid: true } | { valid: false; expired: boolean };

/**
 * Verify a 6-digit TOTP code.
 * - Accepts ±30 s (window=1) for the current period to handle clock skew.
 * - If the code is not valid now but WAS valid up to 5 periods ago (~2.5 min),
 *   returns { valid: false, expired: true } so the caller can give a specific
 *   "code expired" message rather than "invalid code".
 */
function totpVerify(token: string, secret: string): TotpResult {
  if (!/^\d{6}$/.test(token)) return { valid: false, expired: false };
  const step = Math.floor(Date.now() / 1000 / 30);
  // Accept current window ±1 (handles minor clock skew / slow typers)
  for (let i = -1; i <= 1; i++) {
    if (totpToken(secret, step + i) === token) return { valid: true };
  }
  // Check if the code was valid recently but is now expired (2–10 periods ago)
  for (let i = -10; i <= -2; i++) {
    if (totpToken(secret, step + i) === token) return { valid: false, expired: true };
  }
  return { valid: false, expired: false };
}

// ── Auth guard ─────────────────────────────────────────────────────────────
function requireAuth(req: Request, res: Response): string | null {
  const userId = req.user?.id;
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return null; }
  return userId;
}

// ── GET /api/2fa/setup ─────────────────────────────────────────────────────
router.get("/2fa/setup", async (req: Request, res: Response) => {
  const userId = requireAuth(req, res);
  if (!userId) return;
  try {
    await ensure2FASchema();
    const secret = generateTotpSecret();
    const { rows } = await pool.query("SELECT email FROM sim_users WHERE id = $1", [userId]);
    const email = rows[0]?.email ?? "user";

    await pool.query("UPDATE sim_users SET totp_pending_secret = $1 WHERE id = $2", [secret, userId]);

    const otpauth = buildOtpAuthUri(email, "SKY SMS", secret);
    const qrDataUrl = await QRCode.toDataURL(otpauth, { width: 256, margin: 2 });

    res.json({ secret, qrDataUrl, otpauth });
  } catch (err) {
    console.error("2FA setup error:", err);
    res.status(500).json({ error: "Failed to generate 2FA secret" });
  }
});

// ── POST /api/2fa/verify-setup ─────────────────────────────────────────────
router.post("/2fa/verify-setup", async (req: Request, res: Response) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const code = String(req.body?.code ?? "").trim();
  if (!code || code.length !== 6) {
    res.status(400).json({ error: "Please enter a 6-digit code" });
    return;
  }
  try {
    const { rows } = await pool.query(
      "SELECT totp_pending_secret FROM sim_users WHERE id = $1", [userId],
    );
    const secret = rows[0]?.totp_pending_secret;
    if (!secret) {
      res.status(400).json({ error: "No 2FA setup in progress. Please start setup again." });
      return;
    }
    const result = totpVerify(code, secret);
    if (!result.valid) {
      const msg = result.expired
        ? "Code expired. Please enter a fresh code from your authenticator app."
        : "Invalid code. Please try again.";
      res.status(400).json({ error: msg });
      return;
    }
    await pool.query(
      "UPDATE sim_users SET totp_secret = $1, totp_enabled = TRUE, totp_pending_secret = NULL WHERE id = $2",
      [secret, userId],
    );
    res.json({ success: true });
  } catch (err) {
    console.error("2FA verify-setup error:", err);
    res.status(500).json({ error: "Failed to verify 2FA code" });
  }
});

// ── POST /api/2fa/disable ──────────────────────────────────────────────────
router.post("/2fa/disable", async (req: Request, res: Response) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const code = String(req.body?.code ?? "").trim();
  if (!code) {
    res.status(400).json({ error: "Please enter your current 2FA code" });
    return;
  }
  try {
    const { rows } = await pool.query(
      "SELECT totp_secret, totp_enabled FROM sim_users WHERE id = $1", [userId],
    );
    const { totp_secret, totp_enabled } = rows[0] ?? {};
    if (!totp_enabled || !totp_secret) {
      res.status(400).json({ error: "2FA is not enabled" });
      return;
    }
    const result = totpVerify(code, totp_secret);
    if (!result.valid) {
      const msg = result.expired
        ? "Code expired. Please enter a fresh code from your authenticator app."
        : "Invalid code. 2FA not disabled.";
      res.status(400).json({ error: msg });
      return;
    }
    await pool.query(
      "UPDATE sim_users SET totp_secret = NULL, totp_enabled = FALSE WHERE id = $1", [userId],
    );
    res.json({ success: true });
  } catch (err) {
    console.error("2FA disable error:", err);
    res.status(500).json({ error: "Failed to disable 2FA" });
  }
});

// ── POST /api/2fa/verify  (login flow) ────────────────────────────────────
router.post("/2fa/verify", async (req: Request, res: Response) => {
  const pendingUserId = req.cookies?.["pending_2fa_user"];
  if (!pendingUserId) {
    res.status(400).json({ error: "No 2FA session in progress" });
    return;
  }
  const code = String(req.body?.code ?? "").trim();
  if (!code || code.length !== 6) {
    res.status(400).json({ error: "Please enter a 6-digit code" });
    return;
  }
  try {
    const { rows } = await pool.query(
      "SELECT totp_secret FROM sim_users WHERE id = $1 AND totp_enabled = TRUE", [pendingUserId],
    );
    const secret = rows[0]?.totp_secret;
    if (!secret) {
      res.status(400).json({ error: "2FA not configured for this user" });
      return;
    }
    const result = totpVerify(code, secret);
    if (!result.valid) {
      const msg = result.expired
        ? "Code expired. Please enter a fresh code from your authenticator app."
        : "Invalid code. Please try again.";
      res.status(400).json({ error: msg });
      return;
    }

    const sessionRow = await pool.query(
      "SELECT session_data FROM sim_pending_2fa WHERE user_id = $1", [pendingUserId],
    );
    if (!sessionRow.rows[0]) {
      res.status(400).json({ error: "Session expired. Please sign in again." });
      return;
    }
    const sessionData = sessionRow.rows[0].session_data;

    const { createSession, SESSION_COOKIE, SESSION_TTL_MS } = await import("../lib/auth.js");
    const sid = await createSession(sessionData);
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie(SESSION_COOKIE, sid, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: SESSION_TTL_MS,
    });

    await pool.query("DELETE FROM sim_pending_2fa WHERE user_id = $1", [pendingUserId]);
    res.clearCookie("pending_2fa_user", { path: "/" });

    res.json({ success: true });
  } catch (err) {
    console.error("2FA verify error:", err);
    res.status(500).json({ error: "Failed to verify 2FA code" });
  }
});

// ── GET /api/2fa/status ────────────────────────────────────────────────────
router.get("/2fa/status", async (req: Request, res: Response) => {
  const userId = requireAuth(req, res);
  if (!userId) return;
  try {
    const { rows } = await pool.query(
      "SELECT totp_enabled FROM sim_users WHERE id = $1", [userId],
    );
    res.json({ enabled: rows[0]?.totp_enabled ?? false });
  } catch {
    res.status(500).json({ error: "Failed to check 2FA status" });
  }
});

export default router;
