import express from "express";
import db from "../../db/index.js";
import auth from "../../middleware/auth.js";
import admin from "../../middleware/admin.js";

const router = express.Router();

router.get("/", auth, admin, async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);

  const total = await db.get(
    "SELECT COUNT(*) as total FROM logs"
  );

  const todayCount = await db.get(
    "SELECT COUNT(*) as today FROM logs WHERE created_at LIKE ?",
    [`${today}%`]
  );

  const byEndpoint = await db.all(`
    SELECT endpoint, COUNT(*) as count
    FROM logs
    GROUP BY endpoint
    ORDER BY count DESC
  `);

  res.json({
    total_requests: total.total,
    today_requests: todayCount.today,
    by_endpoint: byEndpoint
  });
});

export default router;
