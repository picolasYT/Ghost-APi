import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.json({ error: "Falta la URL de TikTok" });
  }

  try {
    const response = await fetch(
      "https://tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com/vid/index",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host":
            "tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com"
        },
        body: JSON.stringify({
          url
        })
      }
    );

    const data = await response.json();

    if (!data || data.code !== 0) {
      return res.json({
        error: "Error descargando TikTok",
        raw: data
      });
    }

    res.json({
      platform: "tiktok",
      status: "success",
      author: data.author?.nickname || "Desconocido",
      description: data.desc || "",
      video: data.video?.playAddr || null,
      video_no_watermark: data.video?.downloadAddr || null,
      music: data.music?.playUrl || null,
      cover: data.video?.cover || null
    });
  } catch (err) {
    console.error("TikTok error:", err);
    res.json({ error: "Error conectando con TikTok" });
  }
});

export default router;
