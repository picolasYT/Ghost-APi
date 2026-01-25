router.post("/login", (req, res) => {
  const password = req.body.password;

  console.log("Password recibida:", password);
  console.log("ADMIN_PASSWORD env:", process.env.ADMIN_PASSWORD);

  if (!password || !process.env.ADMIN_PASSWORD) {
    return res.redirect("/admin/login.html?error=1");
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.redirect("/admin/login.html?error=1");
  }

  res.cookie("admin", "ok", {
    httpOnly: true,
    sameSite: "strict",
  });

  res.redirect("/admin/dashboard.html");
});
