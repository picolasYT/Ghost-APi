import db from "../db/index.js";

export default async function logRequest(req, res, next) {
  res.on("finish", async () => {
    try {
      await db.run(
        "INSERT INTO logs (user_id, endpoint, ip, status) VALUES (?, ?, ?, ?)",
        [
          req.user?.id || null,
          req.originalUrl,
          req.ip,
          res.statusCode < 400 ? "success" : "error"
        ]
      );
    } catch (e) {
      console.error("LOG ERROR", e.message);
    }
  });

  next();
}
