import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { pool } from "../../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  
  console.log(`📝 [REGISTER] Intento de registro: ${email}`);

  /* =========================
     VALIDACIONES
  ========================= */
  if (!email || !password) {
    console.log("⚠️  [REGISTER] Datos incompletos");
    return res.status(400).json({
      error: "Datos incompletos"
    });
  }

  if (password.length < 6) {
    console.log("⚠️  [REGISTER] Password muy corta");
    return res.status(400).json({
      error: "La contraseña debe tener al menos 6 caracteres"
    });
  }

  try {
    /* =========================
       HASH + API KEY
    ========================= */
    console.log("🔐 Generando hash y API key...");
    const hash = await bcrypt.hash(password, 10);
    const apiKey = crypto.randomBytes(24).toString("hex");

    /* =========================
       INSERT EN POSTGRES
    ========================= */
    console.log("💾 Insertando usuario en BD...");
    const insertResult = await pool.query(
      `INSERT INTO users (email, password, api_key)
       VALUES ($1, $2, $3)
       RETURNING id, email, api_key`,
      [email, hash, apiKey]
    );

    console.log(`✅ [REGISTER] Usuario creado: ID ${insertResult.rows[0].id}`);

    return res.json({
      ok: true,
      message: "Cuenta creada correctamente"
    });

  } catch (err) {
    /* =========================
       DEBUG REAL
    ========================= */
    console.error("\n❌ [REGISTER ERROR]");
    console.error("Mensaje:", err.message);
    console.error("Code:", err.code);
    console.error("Detail:", err.detail);
    console.error("Constraint:", err.constraint);
    console.error("\n");

    // Email duplicado
    if (err.code === "23505") {
      console.log("⚠️  Email ya existe");
      return res.status(409).json({
        error: "El email ya existe"
      });
    }

    // Error de tabla no existe
    if (err.code === "42P01") {
      console.error("❌ Tabla 'users' no existe!");
      return res.status(500).json({
        error: "Error en la base de datos: tabla no encontrada",
        detail: "Contacta al administrador"
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
