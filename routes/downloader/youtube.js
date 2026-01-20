import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Falta el parámetro url" });
  }

  try {
    // Extraer video ID
    const videoId = url.includes("youtu.be")
      ? url.split("youtu.be/")[1].split("?")[0]
      : url.split("v=")[1].split("&")[0];

    const apiUrl = `https://piped.video/api/v1/streams/${videoId}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: "No se pudo obtener el video"
      });
    }

    // Respuesta limpia
    res.json({
      platform: "youtube",
      status: "success",
      title: data.title,
      duration: data.duration,
      videoStreams: data.videoStreams?.slice(0, 3),
      audioStreams: data.audioStreams?.slice(0, 3)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error procesando la solicitud"
    });
  }
});

export default router;
