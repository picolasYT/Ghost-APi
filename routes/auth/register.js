import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { pool } from "../../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ error: "Datos incompletos" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const apiKey = crypto.randomBytes(24).toString("hex");

    await pool.query(
      "INSERT INTO users (email, password, api_key) VALUES ($1,$2,$3)",
      [email, hash, apiKey]
    );

    res.json({ ok: true });
  } catch (err) {
    if (err.code === "23505") {
      return res.json({ error: "El email ya existe" });
    }

    console.error(err);
    res.json({ error: "Error creando la cuenta" });
  }
});

export default router;
