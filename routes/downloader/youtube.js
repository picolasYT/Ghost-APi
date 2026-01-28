import express from "express";
import fetch from "node-fetch";

const router = express.Router();

/* =========================
   RAPIDAPI CONFIG (HARDCODE)
========================= */
const RAPID_HOST = "youtube-media-downloader.p.rapidapi.com";
const RAPID_KEY = "814651014emsh71e028776d9a33dp1600e6jsn2e4b042ad0f6"; // ⬅️ HARD CODE

/* =========================
   GET CHANNEL POSTS
========================= */
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
        method: "GET",
        headers: {
          "x-rapidapi-host": RAPID_HOST,
          "x-rapidapi-key": RAPID_KEY,
          "User-Agent": "Ghost-API/1.0"
        }
      }
    );

    const text = await response.text();

    // 🔎 DEBUG REAL
    console.log("YT RAW RESPONSE:", text.slice(0, 300));

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({
        ok: false,
        error: "RapidAPI did not return JSON",
        raw: text.slice(0, 300)
      });
    }

    return res.json({
      ok: true,
      source: "youtube-media-downloader",
      data
    });

  } catch (err) {
    console.error("YT POSTS ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: "Error processing YouTube request"
    });
  }
});

export default router;
