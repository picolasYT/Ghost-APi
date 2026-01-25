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
      "https://tiktok-download-without-watermark.p.rapidapi.com/analysis",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host":
            "tiktok-download-without-watermark.p.rapidapi.com"
        },
        body: JSON.stringify({
          url
        })
      }
    );

    const data = await response.json();

    if (!data || data.code !== 0) {
      console.error("TikTok API error:", data);
      return res.json({ error: "Error descargando TikTok" });
    }

    res.json({
      platform: "tiktok",
      status: "success",
      author: data.data.author?.nickname || "Desconocido",
      description: data.data.desc || "",
      video: data.data.play,
      video_no_watermark: data.data.play,
      music: data.data.music
    });
  } catch (err) {
    console.error("TikTok fetch error:", err);
    res.json({ error: "Error descargando TikTok" });
  }
});

export default router;
