import express from "express";
import fetch from "node-fetch";

const router = express.Router();

/**
 * GET /api/download/tiktok?url=
 */
router.get("/", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      error: "Falta la URL de TikTok"
    });
  }

  try {
    const api = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const response = await fetch(api);
    const data = await response.json();

    if (!data || !data.data) {
      console.error("TikWM response:", data);
      return res.status(500).json({
        error: "No se pudo descargar el TikTok"
      });
    }

    res.json({
      platform: "tiktok",
      status: "success",
      author: data.data.author?.nickname || "Desconocido",
      description: data.data.title || "",
      video: data.data.play,
      video_no_watermark: data.data.play,
      music: data.data.music || null
    });

  } catch (err) {
    console.error("TikTok ERROR:", err);
    res.status(500).json({
      error: "Error descargando TikTok"
    });
  }
});

export default router;
