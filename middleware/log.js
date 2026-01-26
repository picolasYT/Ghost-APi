import fs from "fs";
import path from "path";
import geoip from "geoip-lite";

const LOG_FILE = path.resolve("logs.json");

// asegurarse de que exista
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, "[]", "utf-8");
}

export function readLogs() {
  try {
    const data = fs.readFileSync(LOG_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function writeLog(entry) {
  const logs = readLogs();
  logs.push(entry);

  // limitar a últimos 500
  if (logs.length > 500) {
    logs.splice(0, logs.length - 500);
  }

  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

export default function logRequest(req, res, next) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  const geo = geoip.lookup(ip);
  const country = geo?.country || "XX";

  writeLog({
    ip,
    country,
    path: req.originalUrl,
    method: req.method,
    ua: req.headers["user-agent"],
    time: new Date().toISOString()
  });

  next();
}
