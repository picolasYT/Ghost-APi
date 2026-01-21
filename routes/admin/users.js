import express from "express";
import db from "../../db/index.js";
import auth from "../../middleware/auth.js";
import admin from "../../middleware/admin.js";

const router = express.Router();

router.get("/", auth, admin, async (req, res) => {
  const users = await db.all(`
    SELECT 
      u.id,
      u.email,
      u.created_at,
      IFNULL(r.count, 0) as requests_today
    FROM users u
    LEFT JOIN requests r
      ON r.user_id = u.id
      AND r.date = DATE('now')
  `);

  res.json(users);
});

export default router;
