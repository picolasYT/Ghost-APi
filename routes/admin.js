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

  if (password === process.env.ADMIN_PASSWORD) {
    res.cookie("admin", "true", {
      httpOnly: true,
      sameSite: "strict"
    });
    return res.redirect("/api/admin");
  }

  res.redirect("/admin/login.html?error=1");
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
  res.json(logs.reverse());
});

export default router;
