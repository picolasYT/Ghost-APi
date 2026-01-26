const ADMIN_TOKEN = "ghost-token-123";

export default function adminAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ error: "No auth header" });
  }

  const token = auth.replace("Bearer ", "");

  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({ error: "Token inválido" });
  }

  next();
}
