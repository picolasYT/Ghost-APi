import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Falta la URL de Instagram" });
  }

  try {
    const api = `https://ssyoutube.com/api/instagram?url=${encodeURIComponent(url)}`;
    const response = await fetch(api);
    const data = await response.json();

    if (!data || (!data.video && !data.image)) {
      return res.status(500).json({ error: "No se pudo descargar Instagram" });
    }

    res.json({
      platform: "instagram",
      status: "success",
      video: data.video || null,
      image: data.image || null,
      description: data.title || ""
    });
  } catch (err) {
    console.error("Instagram ERROR:", err);
    res.status(500).json({ error: "Error descargando Instagram" });
  }
});

export default router;
