import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { readLogs } from "../middleware/log.js";

const router = express.Router();

// =========================
// CONFIG ADMIN (HARDCODE)
// =========================
const ADMIN_PASSWORD = "ghostadmin123";
const ADMIN_TOKEN = "ghost-token-123";

// =========================
// LOGIN
// =========================
router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Falta password" });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Password incorrecta" });
  }

  return res.json({ token: ADMIN_TOKEN });
});

// =========================
// CHECK AUTH (TEST)
// =========================
router.get("/check", adminAuth, (req, res) => {
  res.json({ ok: true });
});

// =========================
// LOGS
// =========================
router.get("/logs", adminAuth, (req, res) => {
  const logs = readLogs();
  res.json(logs.slice().reverse()); // últimos primero
});

// =========================
// STATS POR ENDPOINT
// =========================
router.get("/stats", adminAuth, (req, res) => {
  const logs = readLogs();
  const stats = {};

  logs.forEach(log => {
    stats[log.path] = (stats[log.path] || 0) + 1;
  });

  res.json(stats);
});

export default router;
