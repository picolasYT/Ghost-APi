export default function adminAuth(req, res, next) {
  if (req.cookies?.admin === "ok") {
    return next();
  }

  return res.status(401).json({ error: "No autorizado" });
}
