import express from "express";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// ⚠️ PASSWORD FIJA (hardcodeada)
const ADMIN_PASSWORD = "ghostadmin123";
const ADMIN_TOKEN = "ghost-token-123";

/* LOGIN */
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

/* RUTA PROTEGIDA DE PRUEBA */
router.get("/check", adminAuth, (req, res) => {
  res.json({ ok: true });
});

export default router;
