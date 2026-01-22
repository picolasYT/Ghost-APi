import { pool } from "../db.js";

const DAILY_LIMIT = 500;

export default async function rateLimit(req, res, next) {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "No autenticado" });

  const today = new Date().toISOString().slice(0, 10);

  let row = await db.get(
    "SELECT * FROM requests WHERE user_id = ? AND date = ?",
    [user.id, today]
  );

  if (!row) {
    await db.run(
      "INSERT INTO requests (user_id, date, count) VALUES (?, ?, 1)",
      [user.id, today]
    );
    return next();
  }

  if (row.count >= DAILY_LIMIT) {
    return res.status(429).json({
      error: "Límite diario alcanzado (500 requests)"
    });
  }

  await db.run(
    "UPDATE requests SET count = count + 1 WHERE id = ?",
    [row.id]
  );

  next();
}
