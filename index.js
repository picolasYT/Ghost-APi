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
console.log("🚀 [INIT] Iniciando Ghost API...");
dotenv.config({
  path: "/etc/secrets/.env"
});

/* =========================
   DEBUG ENV (TEMPORAL)
========================= */
console.log("📋 [ENV] DATABASE_URL configurada:", !!process.env.DATABASE_URL);
console.log("📋 [ENV] JWT_SECRET configurada:", !!process.env.JWT_SECRET);
console.log("📋 [ENV] RAPIDAPI_KEY configurada:", !!process.env.RAPIDAPI_KEY);

if (!process.env.DATABASE_URL) {
  console.error("❌ [ERROR] DATABASE_URL no está configurada!");
}

/* =========================
   APP
========================= */
console.log("⚙️  [SETUP] Inicializando Express...");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));
console.log("✅ [SETUP] Middlewares configurados");

/* =========================
   INIT DATABASE (🔥 CLAVE 🔥)
========================= */
console.log("🔌 [DB] Conectando a PostgreSQL...");
try {
  await initDb();
  console.log("✅ [DB] Base de datos inicializada correctamente");
} catch (err) {
  console.error("❌ [DB ERROR] Falló al inicializar DB:", err.message);
  process.exit(1);
}

/* =========================
   RUTAS API
========================= */
console.log("🛣️  [ROUTES] Registrando rutas...");

/* 🔓 AUTH (NO protegidas) */
app.use("/api/auth", apiRoutes);
console.log("✅ [ROUTES] /api/auth registrada");

/* 🔒 DOWNLOAD (protegidas) */
app.use(
  "/api/download",
  auth,
  rateLimit,
  logRequest,
  apiRoutes
);
console.log("✅ [ROUTES] /api/download registrada");

/* =========================
   START
========================= */
app.listen(PORT, () => {
  console.log(`\n👻 Ghost API ONLINE en puerto ${PORT}\n`);
  console.log("✅ Servidor listo para recibir requests");
});
