export default function adminAuth(req, res, next) {
  if (req.cookies?.admin === "true") {
    return next();
  }

  res.redirect("/admin/login.html");
}
