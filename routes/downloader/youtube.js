import express from "express";
import axios from "axios";

const router = express.Router();

// ⚠️ Hardcode por ahora (después lo pasamos a env)
const RAPID_HOST = "youtube-media-downloader.p.rapidapi.com";
const RAPID_KEY = "814651014emsh71e028776d9a33dp1600e6jsn2e4b042ad0f6";

router.get("/posts", async (req, res) => {
  const { channelId } = req.query;

  if (!channelId) {
    return res.status(400).json({
      ok: false,
      error: "Missing channelId"
    });
  }

  try {
    const { data } = await axios.get(
      `https://${RAPID_HOST}/v2/channel/posts`,
      {
        params: { channelId },
        headers: {
          "x-rapidapi-host": RAPID_HOST,
          "x-rapidapi-key": RAPID_KEY,
          "User-Agent": "Ghost-API/1.0"
        },
        timeout: 15000
      }
    );

    // 🔽 Limpieza del response
    const posts = (data.items || []).map(p => ({
      id: p.id,
      text: p.contentText || "",
      published: p.publishedTimeText,
      votes: p.voteCountText,
      comments: p.commentCountText,
      images: p.images?.[0]?.map(i => i.url) || [],
      poll: p.poll || null
    }));

    return res.json({
      ok: true,
      channelId,
      nextToken: data.nextToken || null,
      count: posts.length,
      posts
    });

  } catch (err) {
    console.error("YT POSTS ERROR:", err.response?.data || err.message);
    return res.status(500).json({
      ok: false,
      error: "Failed to fetch YouTube posts"
    });
  }
});

export default router;
