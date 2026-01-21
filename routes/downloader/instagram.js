import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.json({ error: "Falta URL de Instagram" });
  }

  try {
    const response = await fetch(
      "https://instagram120.p.rapidapi.com/api/instagram/media",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": process.env.RAPIDAPI_HOST,
          "x-rapidapi-key": process.env.RAPIDAPI_KEY
        },
        body: JSON.stringify({
          url
        })
      }
    );

    const data = await response.json();

    if (!data || !data.video) {
      return res.json({ error: "No se pudo obtener el video" });
    }

    res.json({
      platform: "instagram",
      status: "success",
      video: data.video
    });
  } catch (err) {
    console.error(err);
    res.json({ error: "Error conectando con Instagram" });
  }
});

export default router;
