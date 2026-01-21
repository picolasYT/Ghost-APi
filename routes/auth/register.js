import express from "express";
import bcrypt from "bcryptjs";

const router = express.Router();

const users = []; // luego DB

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ error: "Datos incompletos" });
  }

  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.json({ error: "El email ya existe" });
  }

  const hash = await bcrypt.hash(password, 10);

  users.push({
    email,
    password: hash,
    role: "user"
  });

  res.json({ ok: true });
});

export default router;
