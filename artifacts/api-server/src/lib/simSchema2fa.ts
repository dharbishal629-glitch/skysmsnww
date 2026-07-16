/**
 * Migration: add 2FA columns and pending_2fa table to existing schema.
 * Called once during server startup after ensureSimSchema().
 */
import { pool } from "@workspace/db";

let done = false;

export async function ensure2FASchema(): Promise<void> {
  if (done) return;
  done = true;
  await pool.query(`
    ALTER TABLE sim_users
      ADD COLUMN IF NOT EXISTS totp_secret TEXT,
      ADD COLUMN IF NOT EXISTS totp_pending_secret TEXT,
      ADD COLUMN IF NOT EXISTS totp_enabled BOOLEAN NOT NULL DEFAULT FALSE;

    CREATE TABLE IF NOT EXISTS sim_pending_2fa (
      user_id TEXT PRIMARY KEY REFERENCES sim_users(id) ON DELETE CASCADE,
      session_data JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}
