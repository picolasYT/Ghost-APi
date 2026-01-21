import express from "express";
import db from "../../db/index.js";
import auth from "../../middleware/auth.js";
import admin from "../../middleware/admin.js";

const router = express.Router();

router.get("/", auth, admin, async (req, res) => {
  const logs = await db.all(`
    SELECT *
    FROM logs
    ORDER BY created_at DESC
    LIMIT 100
  `);
  res.json(logs);
});

export default router;
