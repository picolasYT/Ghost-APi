import geoip from "geoip-lite";

export const logs = [];

export default function logRequest(req, res, next) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  const geo = geoip.lookup(ip);
  const country = geo?.country || "XX";

  logs.push({
    ip,
    country,              // 👈 NUEVO
    path: req.originalUrl,
    method: req.method,
    ua: req.headers["user-agent"],
    time: new Date().toISOString()
  });

  next();
}
