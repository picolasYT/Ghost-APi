import fetch from "node-fetch";

export default async function instagram(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username requerido" });
  }

  try {
    const response = await fetch(
      "https://instagram120.p.rapidapi.com/api/instagram/posts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": "instagram120.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY
        },
        body: JSON.stringify({
          username,
          maxId: ""
        })
      }
    );

    const data = await response.json();

    const post = data.items?.find(
      (i) => i.video_versions && i.video_versions.length
    );

    if (!post) {
      return res.status(404).json({
        error: "No se encontraron videos"
      });
    }

    res.json({
      platform: "instagram",
      status: "success",
      author: username,
      video: post.video_versions[0].url,
      thumbnail:
        post.image_versions2?.candidates?.[0]?.url || null
    });

  } catch (err) {
    console.error("IG ERROR:", err.message);
    res.status(503).json({
      error: "Instagram no disponible en este momento"
    });
  }
}
