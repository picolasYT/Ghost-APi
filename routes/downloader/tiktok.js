import express from "express";
import fetch from "node-fetch";

const router = express.Router();

/**
 * GET /api/download/tiktok?url=
 */
router.get("/", async (req, res) => {
  const { url } = req.query;

  // 1️⃣ Validación básica
  if (!url) {
    return res.status(400).json({
      error: "Falta la URL de TikTok"
    });
  }

  try {
    // 2️⃣ Llamada a RapidAPI
    const response = await fetch(
      "https://tiktok-download-without-watermark.p.rapidapi.com/analysis",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host":
            "tiktok-download-without-watermark.p.rapidapi.com"
        },
        body: JSON.stringify({ url })
      }
    );

    // 3️⃣ Parseo
    const data = await response.json();

    // 4️⃣ Manejo de errores de API externa
    if (!data || data.code !== 0 || !data.data) {
      console.error("TikTok API response:", data);
      return res.status(500).json({
        error: "Error descargando TikTok"
      });
    }

    // 5️⃣ Respuesta limpia para TU API
    res.json({
      platform: "tiktok",
      status: "success",
      author: data.data.author?.nickname || "Desconocido",
      description: data.data.desc || "",
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
