const logs = [];

export default function logRequest(req, res, next) {
  logs.push({
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    path: req.originalUrl,
    method: req.method,
    ua: req.headers["user-agent"],
    time: new Date().toISOString()
  });

  // mantener solo últimos 500
  if (logs.length > 500) logs.shift();

  req.logs = logs;
  next();
}

export { logs };
