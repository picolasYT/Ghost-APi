import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { logs } from "../middleware/log.js";

const router = express.Router();

/* ======================
   LOGIN FORM
====================== */
router.get("/login", (req, res) => {
  res.sendFile(process.cwd() + "/public/admin/login.html");
});

/* ======================
   LOGIN POST
====================== */
router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.redirect("/admin/login.html?error=1");
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.redirect("/admin/login.html?error=1");
  }

  // Cookie válida
  res.cookie("admin", "ok", {
    httpOnly: true,
    sameSite: "strict",
  });

  res.redirect("/admin/dashboard.html");
});

/* ======================
   LOGOUT
====================== */
router.get("/logout", (req, res) => {
  res.clearCookie("admin");
  res.redirect("/admin/login.html");
});

/* ======================
   DASHBOARD (PROTEGIDO)
====================== */
router.get("/", adminAuth, (req, res) => {
  res.sendFile(process.cwd() + "/public/admin/dashboard.html");
});

/* ======================
   LOGS (PROTEGIDO)
====================== */
router.get("/logs", adminAuth, (req, res) => {
  res.json([...logs].reverse());
});

/* ======================
   STATS (PROTEGIDO)
====================== */
router.get("/stats", adminAuth, (req, res) => {
  const stats = {};

  logs.forEach(l => {
    stats[l.path] = (stats[l.path] || 0) + 1;
  });

  res.json(stats);
});

export default router;
