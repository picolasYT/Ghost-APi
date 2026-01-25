export default function adminAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autorizado" });
  }

  const token = auth.split(" ")[1];

  if (token !== (process.env.ADMIN_TOKEN || "ghost-admin-token")) {
    return res.status(403).json({ error: "Token inválido" });
  }

  next();
}
