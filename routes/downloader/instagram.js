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
    const apiUrl = `https://igram.world/api/ig/media/?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || !data.medias || data.medias.length === 0) {
      return res.status(500).json({
        error: "No se pudo procesar el contenido de Instagram"
      });
    }

    const media = data.medias[0];

    res.json({
      platform: "instagram",
      status: "success",
      type: media.type,
      video: media.url,
      thumbnail: media.thumbnail
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error conectando con Instagram"
    });
  }
});

export default router;
