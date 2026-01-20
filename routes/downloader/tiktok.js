import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.json({ error: "Falta el parámetro url" });
  }

  res.json({
    platform: "tiktok",
    status: "ready",
    url,
    download: "https://example.com/video.mp4"
  });
});

export default router;
