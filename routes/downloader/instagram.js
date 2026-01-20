import express from "express";
import fetch from "node-fetch";

const router = express.Router();

const PROVIDERS = [
  // Provider 1
  (url) => `https://igram.world/api/ig/media/?url=${encodeURIComponent(url)}`,

  // Provider 2 (fallback)
  (url) => `https://ddinstagram.com/reel/${extractReelId(url)}`
];

// Helper para sacar ID del reel
function extractReelId(url) {
  try {
    const match = url.match(/reel\/([^/?]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

router.get("/", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Falta el parámetro url" });
  }

  // Solo reels por ahora
  if (!url.includes("/reel/")) {
    return res.status(400).json({
      error: "Solo se soportan links de Instagram Reels"
    });
  }

  for (const buildUrl of PROVIDERS) {
    try {
      const apiUrl = buildUrl(url);
      if (!apiUrl) continue;

      const r = await fetch(apiUrl, { timeout: 8000 });

      // Provider 1 (JSON)
      if (r.ok && apiUrl.includes("igram.world")) {
        const data = await r.json();
        if (data?.medias?.length) {
          return res.json({
            platform: "instagram",
            status: "success",
            video: data.medias[0].url,
            thumbnail: data.medias[0].thumbnail
          });
        }
      }

      // Provider 2 (HTML scrape simple)
      if (r.ok && apiUrl.includes("ddinstagram")) {
        const html = await r.text();
        const match = html.match(/href="(https:\/\/[^"]+\.mp4[^"]*)"/);
        if (match) {
          return res.json({
            platform: "instagram",
            status: "success",
            video: match[1]
          });
        }
      }
    } catch (e) {
      // seguimos al siguiente provider
    }
  }

  // Si ninguno respondió
  res.status(503).json({
    error: "Instagram no disponible en este momento"
  });
});

export default router;
