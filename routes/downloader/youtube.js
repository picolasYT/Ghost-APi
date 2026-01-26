// Hecho por Picolas :3 — YouTube Downloader API
import express from "express";
import ytdl from "ytdl-core";

const router = express.Router();

router.get("/", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      ok: false,
      error: "Falta el parámetro url"
    });
  }

  if (!ytdl.validateURL(url)) {
    return res.status(400).json({
      ok: false,
      error: "URL de YouTube inválida"
    });
  }

  try {
    const info = await ytdl.getInfo(url);

    const formats = ytdl.filterFormats(info.formats, "videoandaudio");

    // ordenar por calidad
    formats.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

    const best = formats[0];

    return res.json({
      ok: true,
      platform: "youtube",
      creator: "Picolas",
      videoId: info.videoDetails.videoId,
      title: info.videoDetails.title,
      duration: Number(info.videoDetails.lengthSeconds),
      channel: info.videoDetails.author?.name || null,
      video: best ? best.url : null,
      alternatives: formats.slice(1, 5).map(f => ({
        quality: f.qualityLabel,
        mime: f.mimeType,
        url: f.url
      }))
    });

  } catch (err) {
    console.error("YouTube ERROR:", err.message);
    return res.status(500).json({
      ok: false,
      error: "Error procesando YouTube"
    });
  }
});

export default router;
