import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ghost_secret";

export default function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token inválido" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
}
