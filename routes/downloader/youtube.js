import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(503).json({
    platform: "youtube",
    status: "maintenance",
    message: "YouTube downloader en mantenimiento. Usá TikTok o Instagram por ahora."
  });
});

export default router;
