/**
 * Account management routes:
 * - PATCH /api/account/profile  — update name/nickname
 * - POST  /api/account/password — change password
 * - DELETE /api/account         — delete account
 */
import { Router, type IRouter, type Request, type Response } from "express";
import { pool } from "@workspace/db";
import bcrypt from "bcryptjs";
import { clearSession, getSessionId } from "../lib/auth";

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

/** PATCH /api/account/profile — update display name */
router.patch("/account/profile", async (req: Request, res: Response) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const name = String(req.body?.name ?? "").trim();
  if (!name || name.length < 2 || name.length > 64) {
    res.status(400).json({ error: "Name must be 2–64 characters." });
    return;
  }

  try {
    await pool.query("UPDATE sim_users SET name = $1 WHERE id = $2", [name, userId]);
    res.json({ success: true, name });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

/** POST /api/account/password — change password (requires current password) */
router.post("/account/password", async (req: Request, res: Response) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const currentPassword = String(req.body?.currentPassword ?? "");
  const newPassword = String(req.body?.newPassword ?? "");

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Current and new password are required." });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ error: "New password must be at least 8 characters." });
    return;
  }

  try {
    const cred = await pool.query(
      "SELECT password_hash FROM sim_email_credentials WHERE user_id = $1",
      [userId],
    );
    if (!cred.rows[0]) {
      res.status(400).json({ error: "No password set. Your account uses Google Sign-In." });
      return;
    }

    const valid = await bcrypt.compare(currentPassword, String(cred.rows[0].password_hash));
    if (!valid) {
      res.status(400).json({ error: "Current password is incorrect." });
      return;
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await pool.query(
      "UPDATE sim_email_credentials SET password_hash = $1 WHERE user_id = $2",
      [newHash, userId],
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ error: "Failed to change password" });
  }
});

/** DELETE /api/account — permanently delete account */
router.delete("/account", async (req: Request, res: Response) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const confirmation = String(req.body?.confirmation ?? "").trim();
  if (confirmation !== "DELETE") {
    res.status(400).json({ error: 'Type "DELETE" to confirm account deletion.' });
    return;
  }

  try {
    // Delete in correct dependency order
    await pool.query("DELETE FROM sim_sms_messages WHERE rental_id IN (SELECT id FROM sim_rentals WHERE user_id = $1)", [userId]);
    await pool.query("DELETE FROM sim_rentals WHERE user_id = $1", [userId]);
    await pool.query("DELETE FROM sim_payments WHERE user_id = $1", [userId]);
    await pool.query("DELETE FROM sim_email_credentials WHERE user_id = $1", [userId]);
    await pool.query("DELETE FROM sim_pending_2fa WHERE user_id = $1", [userId]).catch(() => {});
    // Invalidate all sessions
    await pool.query(
      "DELETE FROM sim_sessions WHERE sess->>'user' LIKE $1",
      [`%${userId}%`],
    ).catch(() => {});
    await pool.query("DELETE FROM sim_users WHERE id = $1", [userId]);

    // Clear the session cookie
    const sid = getSessionId(req);
    await clearSession(res, sid);

    res.json({ success: true });
  } catch (err) {
    console.error("Account deletion error:", err);
    res.status(500).json({ error: "Failed to delete account. Please contact support." });
  }
});

export default router;
