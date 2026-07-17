/**
 * Activity log route
 * GET /api/activity — returns a unified timeline of account events
 */
import { Router, type IRouter, type Request, type Response } from "express";
import { pool } from "@workspace/db";

const router: IRouter = Router();

function requireAuth(req: Request, res: Response): string | null {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return null;
  }
  return userId;
}

/** GET /api/activity */
router.get("/activity", async (req: Request, res: Response) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  try {
    const result = await pool.query<{
      id: string;
      type: string;
      description: string;
      created_at: Date;
    }>(
      `
      -- Rentals created
      SELECT
        id,
        'rental_created'  AS type,
        'Rented ' || service_name || ' number (' || LEFT(phone_number, 10) || '...)' AS description,
        created_at
      FROM sim_rentals
      WHERE user_id = $1

      UNION ALL

      -- Cancelled rentals (approximate time = expires_at or created_at+20min)
      SELECT
        id || '_cancelled',
        'rental_cancelled',
        service_name || ' rental cancelled (refunded)',
        COALESCE(expires_at, created_at + INTERVAL '20 minutes')
      FROM sim_rentals
      WHERE user_id = $1 AND status = 'cancelled'

      UNION ALL

      -- Expired rentals
      SELECT
        id || '_expired',
        'rental_expired',
        service_name || ' rental expired after ' ||
          COALESCE(activation_minutes::text || ' minutes', '20 minutes'),
        COALESCE(expires_at, created_at + INTERVAL '20 minutes')
      FROM sim_rentals
      WHERE user_id = $1 AND status = 'expired'

      UNION ALL

      -- SMS received
      SELECT
        sm.id,
        'sms_received',
        CASE
          WHEN sm.code IS NOT NULL AND sm.code <> ''
            THEN 'SMS code received: ' || sm.code
          ELSE 'SMS received: ' || LEFT(sm.message, 40)
        END,
        sm.received_at
      FROM sim_sms_messages sm
      JOIN sim_rentals r ON sm.rental_id = r.id
      WHERE r.user_id = $1

      UNION ALL

      -- Confirmed payments
      SELECT
        id,
        'payment',
        'Balance topped up +' || TO_CHAR(amount, 'FM9999990.00'),
        created_at
      FROM sim_payments
      WHERE user_id = $1 AND status = 'confirmed'

      UNION ALL

      -- Manual activity log (logins, security changes, etc.)
      SELECT id, type, description, created_at
      FROM sim_activity_log
      WHERE user_id = $1

      ORDER BY created_at DESC
      LIMIT 100
      `,
      [userId],
    );

    const events = result.rows.map((row) => ({
      id: row.id,
      type: row.type,
      description: row.description,
      createdAt: row.created_at,
    }));

    res.json({ events });
  } catch (err) {
    console.error("Activity fetch error:", err);
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});

export default router;
