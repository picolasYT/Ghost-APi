import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  const user = result.rows[0];
  if (!user) return res.json({ error: "Credenciales inválidas" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.json({ error: "Credenciales inválidas" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    api_key: user.api_key,
    role: user.role
  });
});

export default router;
