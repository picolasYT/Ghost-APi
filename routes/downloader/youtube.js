import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Instancias públicas (fallback)
const INSTANCES = [
  "https://piped.video",
  "https://piped.adminforge.de",
  "https://piped.kavin.rocks"
];

router.get("/", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Falta el parámetro url" });
  }

  try {
    // Extraer ID
    const videoId = url.includes("youtu.be")
      ? url.split("youtu.be/")[1].split("?")[0]
      : url.split("v=")[1]?.split("&")[0];

    if (!videoId) {
      return res.status(400).json({ error: "URL inválida" });
    }

    let data = null;

    for (const base of INSTANCES) {
      try {
        const apiUrl = `${base}/api/v1/streams/${videoId}`;
        const r = await fetch(apiUrl, { timeout: 7000 });
        if (r.ok) {
          data = await r.json();
          break;
        }
      } catch {}
    }

    if (!data) {
      return res.status(503).json({
        error: "No hay instancias disponibles"
      });
    }

    res.json({
      platform: "youtube",
      status: "success",
      title: data.title,
      duration: data.duration,
      video: data.videoStreams?.map(v => ({
        quality: v.quality,
        url: v.url
      })),
      audio: data.audioStreams?.map(a => ({
        bitrate: a.bitrate,
        url: a.url
      }))
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error procesando la solicitud"
    });
  }
});

export default router;
