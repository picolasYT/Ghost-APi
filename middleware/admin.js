export default function admin(req, res, next) {
  // por ahora: tu email es admin
  if (req.user.email !== "picolasliveyt@gmail.com") {
    return res.status(403).json({ error: "Acceso admin requerido" });
  }
  next();
}
