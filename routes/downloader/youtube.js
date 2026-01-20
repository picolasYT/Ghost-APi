import express from "express";
import { exec } from "child_process";
import path from "path";

const router = express.Router();

router.get("/", (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Falta el parámetro url" });
  }

  // 👉 SI ESTÁS EN WINDOWS (LOCAL), DEVOLVEMOS MOCK
  if (process.platform === "win32") {
    return res.json({
      platform: "youtube",
      status: "mock",
      message: "Descarga real solo en Render",
      download: "https://example.com/video.mp4"
    });
  }

  // 👉 MODO REAL (Render / Linux)
  const fileName = `yt-${Date.now()}.mp4`;
  const outputPath = path.join(process.cwd(), fileName);

  const cmd = `./yt-dlp -f mp4 -o "${outputPath}" "${url}"`;

  exec(cmd, (error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error descargando video" });
    }

    res.json({
      platform: "youtube",
      status: "success",
      download: `/files/${fileName}`
    });
  });
});

export default router;
