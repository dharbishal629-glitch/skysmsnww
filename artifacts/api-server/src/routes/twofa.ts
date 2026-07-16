import { Router, type IRouter, type Request, type Response } from "express";
import { pool } from "@workspace/db";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { getSessionId } from "../lib/auth";

const router: IRouter = Router();

function requireAuth(req: Request, res: Response): string | null {
  const session = (req as any).sessionData;
  const userId = session?.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return null;
  }
  return userId;
}

/** GET /api/2fa/setup — generate a new TOTP secret + QR code for the user */
router.get("/2fa/setup", async (req: Request, res: Response) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  try {
    // Generate a new secret
    const secret = authenticator.generateSecret(20);
    const userRow = await pool.query("SELECT email, name FROM sim_users WHERE id = $1", [userId]);
    const email = userRow.rows[0]?.email ?? "user";

    // Store the pending secret (not yet confirmed)
    await pool.query(
      `UPDATE sim_users SET totp_pending_secret = $1 WHERE id = $2`,
      [secret, userId],
    );

    const otpauth = authenticator.keyuri(email, "SKY SMS", secret);
    const qrDataUrl = await QRCode.toDataURL(otpauth, { width: 256, margin: 2 });

    res.json({ secret, qrDataUrl, otpauth });
  } catch (err) {
    console.error("2FA setup error:", err);
    res.status(500).json({ error: "Failed to generate 2FA secret" });
  }
});

/** POST /api/2fa/verify-setup — confirm TOTP with 6-digit code, enable 2FA */
router.post("/2fa/verify-setup", async (req: Request, res: Response) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const code = String(req.body?.code ?? "").trim();
  if (!code || code.length !== 6) {
    res.status(400).json({ error: "Please enter a 6-digit code" });
    return;
  }

  try {
    const row = await pool.query(
      "SELECT totp_pending_secret FROM sim_users WHERE id = $1",
      [userId],
    );
    const secret = row.rows[0]?.totp_pending_secret;
    if (!secret) {
      res.status(400).json({ error: "No 2FA setup in progress. Please start setup again." });
      return;
    }

    const valid = authenticator.verify({ token: code, secret });
    if (!valid) {
      res.status(400).json({ error: "Invalid code. Please try again." });
      return;
    }

    // Activate 2FA
    await pool.query(
      `UPDATE sim_users SET totp_secret = $1, totp_enabled = TRUE, totp_pending_secret = NULL WHERE id = $2`,
      [secret, userId],
    );

    res.json({ success: true });
  } catch (err) {
    console.error("2FA verify-setup error:", err);
    res.status(500).json({ error: "Failed to verify 2FA code" });
  }
});

/** POST /api/2fa/disable — disable 2FA after verifying current code */
router.post("/2fa/disable", async (req: Request, res: Response) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const code = String(req.body?.code ?? "").trim();
  if (!code) {
    res.status(400).json({ error: "Please enter your current 2FA code" });
    return;
  }

  try {
    const row = await pool.query(
      "SELECT totp_secret, totp_enabled FROM sim_users WHERE id = $1",
      [userId],
    );
    const { totp_secret, totp_enabled } = row.rows[0] ?? {};
    if (!totp_enabled || !totp_secret) {
      res.status(400).json({ error: "2FA is not enabled" });
      return;
    }

    const valid = authenticator.verify({ token: code, secret: totp_secret });
    if (!valid) {
      res.status(400).json({ error: "Invalid code. 2FA not disabled." });
      return;
    }

    await pool.query(
      `UPDATE sim_users SET totp_secret = NULL, totp_enabled = FALSE WHERE id = $1`,
      [userId],
    );

    res.json({ success: true });
  } catch (err) {
    console.error("2FA disable error:", err);
    res.status(500).json({ error: "Failed to disable 2FA" });
  }
});

/** POST /api/2fa/verify — validate 6-digit code during login */
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
    const row = await pool.query(
      "SELECT totp_secret FROM sim_users WHERE id = $1 AND totp_enabled = TRUE",
      [pendingUserId],
    );
    const secret = row.rows[0]?.totp_secret;
    if (!secret) {
      res.status(400).json({ error: "2FA not configured for this user" });
      return;
    }

    const valid = authenticator.verify({ token: code, secret });
    if (!valid) {
      res.status(400).json({ error: "Invalid code. Please try again." });
      return;
    }

    // Get session data that was stored
    const sessionRow = await pool.query(
      "SELECT session_data FROM sim_pending_2fa WHERE user_id = $1",
      [pendingUserId],
    );
    if (!sessionRow.rows[0]) {
      res.status(400).json({ error: "Session expired. Please sign in again." });
      return;
    }
    const sessionData = sessionRow.rows[0].session_data;

    // Create the real session
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

    // Cleanup
    await pool.query("DELETE FROM sim_pending_2fa WHERE user_id = $1", [pendingUserId]);
    res.clearCookie("pending_2fa_user", { path: "/" });

    res.json({ success: true });
  } catch (err) {
    console.error("2FA verify error:", err);
    res.status(500).json({ error: "Failed to verify 2FA code" });
  }
});

/** GET /api/2fa/status — check if 2FA is enabled for current user */
router.get("/2fa/status", async (req: Request, res: Response) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  try {
    const row = await pool.query(
      "SELECT totp_enabled FROM sim_users WHERE id = $1",
      [userId],
    );
    const enabled = row.rows[0]?.totp_enabled ?? false;
    res.json({ enabled });
  } catch (err) {
    res.status(500).json({ error: "Failed to check 2FA status" });
  }
});

export default router;
