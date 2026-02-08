import express from "express"
import ytdlp from "youtube-dl-exec"

const router = express.Router()

// ─────────────────────────────
// 🎥 INFO VIDEO
// ─────────────────────────────
router.get("/info", async (req, res) => {
  const { url } = req.query

  if (!url) {
    return res.status(400).json({
      ok: false,
      error: "Missing YouTube URL"
    })
  }

  try {
    const info = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificates: true,
      preferFreeFormats: true,
      addHeader: [
        "User-Agent:Mozilla/5.0"
      ]
    })

    return res.json({
      ok: true,
      id: info.id,
      title: info.title,
      duration: info.duration,
      views: info.view_count,
      channel: info.uploader,
      channelId: info.channel_id,
      thumbnail: info.thumbnail
    })

  } catch (err) {
    console.error("YT-DLP INFO ERROR:", err.stderr || err.message)
    res.status(500).json({
      ok: false,
      error: "Failed to fetch video info"
    })
  }
})

// ─────────────────────────────
// 🎧 AUDIO
// ─────────────────────────────
router.get("/audio", async (req, res) => {
  const { url } = req.query

  if (!url) {
    return res.status(400).json({ ok: false, error: "Missing URL" })
  }

  try {
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="audio.mp3"'
    )

    ytdlp.exec(url, {
      extractAudio: true,
      audioFormat: "mp3",
      output: "-",
      noWarnings: true
    }).stdout.pipe(res)

  } catch (err) {
    console.error("YT-DLP AUDIO ERROR:", err.stderr || err.message)
    res.status(500).json({
      ok: false,
      error: "Failed to download audio"
    })
  }
})

// ─────────────────────────────
// 📺 VIDEO
// ─────────────────────────────
router.get("/video", async (req, res) => {
  const { url } = req.query

  if (!url) {
    return res.status(400).json({ ok: false, error: "Missing URL" })
  }

  try {
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="video.mp4"'
    )

    ytdlp.exec(url, {
      format: "mp4",
      output: "-",
      noWarnings: true
    }).stdout.pipe(res)

  } catch (err) {
    console.error("YT-DLP VIDEO ERROR:", err.stderr || err.message)
    res.status(500).json({
      ok: false,
      error: "Failed to download video"
    })
  }
})

export default router
