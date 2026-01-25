import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { logs } from "../middleware/log.js";

const router = express.Router();

/* =========================
   LOGIN (POST)
========================= */
router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Falta password" });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Password incorrecta" });
  }

  // token simple (suficiente para admin)
  return res.json({
    token: process.env.ADMIN_TOKEN || "ghost-admin-token"
  });
});

/* =========================
   LOGOUT (frontend only)
========================= */
router.post("/logout", (req, res) => {
  // no hay sesión en backend
  res.json({ ok: true });
});

/* =========================
   LOGS
========================= */
router.get("/logs", adminAuth, (req, res) => {
  res.json([...logs].reverse());
});

/* =========================
   STATS
========================= */
router.get("/stats", adminAuth, (req, res) => {
  const stats = {};
  logs.forEach(l => {
    stats[l.path] = (stats[l.path] || 0) + 1;
  });
  res.json(stats);
});

export default router;
