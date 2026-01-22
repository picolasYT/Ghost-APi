import express from "express";
import dotenv from "dotenv";

import apiRoutes from "./routes/index.js";
import auth from "./middleware/auth.js";
import rateLimit from "./middleware/rateLimit.js";
import logRequest from "./middleware/log.js";
import { initDb } from "./initDb.js";

/* =========================
   CARGAR VARIABLES (.env)
   Render Secret Files
========================= */
dotenv.config({
  path: "/etc/secrets/.env"
});

/* =========================
   DEBUG ENV (TEMPORAL)
========================= */
console.log("DATABASE_URL:", !!process.env.DATABASE_URL);
console.log("JWT_SECRET:", !!process.env.JWT_SECRET);
console.log("RAPIDAPI_KEY:", !!process.env.RAPIDAPI_KEY);

/* =========================
   APP
========================= */
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

/* =========================
   INIT DATABASE (🔥 CLAVE 🔥)
========================= */
await initDb();

/* =========================
   RUTAS API
========================= */

/* 🔓 AUTH (NO protegidas) */
app.use("/api/auth", apiRoutes);

/* 🔒 DOWNLOAD (protegidas) */
app.use(
  "/api/download",
  auth,
  rateLimit,
  logRequest,
  apiRoutes
);

/* =========================
   START
========================= */
app.listen(PORT, () => {
  console.log("👻 Ghost API online en puerto", PORT);
});
