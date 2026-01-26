import express from "express";
import fetch from "node-fetch";

const router = express.Router();

const RAPID_HOST = "youtube138.p.rapidapi.com";
const RAPID_KEY = process.env.RAPIDAPI_KEY; // ponela en Render

router.post("/videos", async (req, res) => {
  const { id, filter = "videos_latest", cursor = "" } = req.body;

  if (!id) {
    return res.status(400).json({
      ok: false,
      error: "Falta channel id"
    });
  }

  try {
    const response = await fetch(
      `https://${RAPID_HOST}/channel/videos/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": RAPID_HOST,
          "x-rapidapi-key": RAPID_KEY
        },
        body: JSON.stringify({
          id,
          filter,
          cursor,
          hl: "en",
          gl: "US"
        })
      }
    );

    const data = await response.json();

    return res.json({
      ok: true,
      source: "youtube138",
      ...data
    });

  } catch (err) {
    console.error("YT CHANNEL ERROR:", err.message);
    res.status(500).json({
      ok: false,
      error: "Error obteniendo videos del canal"
    });
  }
});

export default router;
