import pg from "pg";
import dotenv from "dotenv";

dotenv.config({
  path: "/etc/secrets/.env"
});

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
