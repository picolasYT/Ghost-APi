import { pool } from "./db.js";

export async function initDb() {
  try {
    console.log("🔍 Verificando tabla 'users'...");
    
    const result = await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        api_key TEXT UNIQUE,
        requests_today INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ [DB] Tabla 'users' verificada/creada correctamente");
    
    // Verificar que la tabla existe
    const tableCheck = await pool.query(
      `SELECT * FROM information_schema.tables WHERE table_name = 'users'`
    );
    
    if (tableCheck.rows.length === 0) {
      throw new Error("Tabla 'users' no existe después de CREATE");
    }
    
    console.log("✅ [DB] Conexión a PostgreSQL validada");
    
  } catch (err) {
    console.error("❌ [INIT DB ERROR] Error iniciando BD:", err.message);
    console.error("❌ [INIT DB ERROR] Code:", err.code);
    console.error("❌ [INIT DB ERROR] Detail:", err.detail);
    throw err;
  }
}
