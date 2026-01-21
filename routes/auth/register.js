import express from "express";
import bcrypt from "bcrypt";
import db from "../../db/index.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y password requeridos" });
  }

  const hash = await bcrypt.hash(password, 10);

  try {
    await db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hash]
    );

    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: "Usuario ya existe" });
  }
});

export default router;
