import express from "express";
import fetch from "node-fetch";

const router = express.Router();

const RAPID_HOST = "youtube-media-downloader.p.rapidapi.com";
const RAPID_KEY = process.env.RAPIDAPI_KEY;

router.get("/posts", async (req, res) => {
  const { channelId } = req.query;

  if (!channelId) {
    return res.status(400).json({
      ok: false,
      error: "Missing channelId"
    });
  }

  try {
    const response = await fetch(
      `https://${RAPID_HOST}/v2/channel/posts?channelId=${encodeURIComponent(channelId)}`,
      {
        headers: {
          "x-rapidapi-host": RAPID_HOST,
          "x-rapidapi-key": RAPID_KEY
        }
      }
    );

    const data = await response.json();

    return res.json({
      ok: true,
      source: "youtube-media-downloader",
      ...data
    });

  } catch (err) {
    console.error("YT POSTS ERROR:", err.message);
    res.status(500).json({
      ok: false,
      error: "Error fetching channel posts"
    });
  }
});

export default router;
