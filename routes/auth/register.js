import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { pool } from "../../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  /* =========================
     VALIDACIONES
  ========================= */
  if (!email || !password) {
    return res.status(400).json({
      error: "Datos incompletos"
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: "La contraseña debe tener al menos 6 caracteres"
    });
  }

  try {
    /* =========================
       HASH + API KEY
    ========================= */
    const hash = await bcrypt.hash(password, 10);
    const apiKey = crypto.randomBytes(24).toString("hex");

    /* =========================
       INSERT EN POSTGRES
    ========================= */
    await pool.query(
      `INSERT INTO users (email, password, api_key)
       VALUES ($1, $2, $3)`,
      [email, hash, apiKey]
    );

    return res.json({
      ok: true,
      message: "Cuenta creada correctamente"
    });

  } catch (err) {
    /* =========================
       DEBUG REAL
    ========================= */
    console.error("REGISTER ERROR:", err);

    // Email duplicado
    if (err.code === "23505") {
      return res.status(409).json({
        error: "El email ya existe"
      });
    }

    return res.status(500).json({
      error: "Error creando la cuenta",
      detail: err.message,
      code: err.code
    });
  }
});

export default router;
