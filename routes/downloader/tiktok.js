import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      error: "Falta el parámetro url"
    });
  }

  try {
    const apiUrl = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || data.code !== 0) {
      return res.status(500).json({
        error: "No se pudo procesar el video de TikTok"
      });
    }

    res.json({
      platform: "tiktok",
      status: "success",
      author: data.data.author?.nickname,
      description: data.data.title,
      video: data.data.play,
      video_no_watermark: data.data.play,
      music: data.data.music,
      cover: data.data.cover
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error conectando con TikTok"
    });
  }
});

export default router;
