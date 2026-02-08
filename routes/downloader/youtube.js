import express from "express"
import ytdl from "ytdl-core"

const router = express.Router()

// ─────────────────────────────
// 🎥 INFO DEL VIDEO
// /youtube/info?url=
// ─────────────────────────────
router.get("/info", async (req, res) => {
  const { url } = req.query

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({
      ok: false,
      error: "Invalid or missing YouTube URL"
    })
  }

  try {
    const info = await ytdl.getInfo(url)
    const v = info.videoDetails

    return res.json({
      ok: true,
      id: v.videoId,
      title: v.title,
      description: v.description,
      duration: v.lengthSeconds,
      views: v.viewCount,
      author: v.author?.name,
      channelId: v.author?.id,
      thumbnail: v.thumbnails?.pop()?.url
    })

  } catch (err) {
    console.error("YT INFO ERROR:", err.message)
    return res.status(500).json({
      ok: false,
      error: "Failed to fetch video info"
    })
  }
})

// ─────────────────────────────
// 🎧 DESCARGA AUDIO MP3
// /youtube/audio?url=
// ─────────────────────────────
router.get("/audio", async (req, res) => {
  const { url } = req.query

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({
      ok: false,
      error: "Invalid or missing YouTube URL"
    })
  }

  try {
    const info = await ytdl.getInfo(url)
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, "")

    res.setHeader("Content-Disposition", `attachment; filename="${title}.mp3"`)

    ytdl(url, {
      filter: "audioonly",
      quality: "highestaudio"
    }).pipe(res)

  } catch (err) {
    console.error("YT AUDIO ERROR:", err.message)
    res.status(500).json({
      ok: false,
      error: "Failed to download audio"
    })
  }
})

// ─────────────────────────────
// 📺 DESCARGA VIDEO MP4
// /youtube/video?url=
// ─────────────────────────────
router.get("/video", async (req, res) => {
  const { url } = req.query

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({
      ok: false,
      error: "Invalid or missing YouTube URL"
    })
  }

  try {
    const info = await ytdl.getInfo(url)
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, "")

    res.setHeader("Content-Disposition", `attachment; filename="${title}.mp4"`)

    ytdl(url, {
      quality: "highestvideo"
    }).pipe(res)

  } catch (err) {
    console.error("YT VIDEO ERROR:", err.message)
    res.status(500).json({
      ok: false,
      error: "Failed to download video"
    })
  }
})

export default router