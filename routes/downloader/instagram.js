import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      status: false,
      error: "Falta la URL de Instagram"
    });
  }

  try {
    const api = `https://ssyoutube.com/api/instagram?url=${encodeURIComponent(url)}`;

    const response = await fetch(api, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json"
      }
    });

    // ⛔ ssyoutube a veces devuelve HTML
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        status: false,
        error: "Respuesta inválida de la API externa"
      });
    }

    // Validación defensiva
    if (!data || (!data.video && !data.image && !data.images)) {
      return res.status(404).json({
        status: false,
        error: "No se pudo extraer contenido de Instagram"
      });
    }

    return res.json({
      platform: "instagram",
      status: true,
      type: data.video ? "video" : "image",
      video: data.video || null,
      images: data.images || (data.image ? [data.image] : null),
      description: data.title || data.caption || ""
    });

  } catch (err) {
    console.error("Instagram ERROR:", err.message);
    return res.status(500).json({
      status: false,
      error: "Error descargando Instagram"
    });
  }
});

export default router;
