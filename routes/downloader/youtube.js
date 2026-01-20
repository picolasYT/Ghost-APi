import express from "express";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

const router = express.Router();

router.get("/", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Falta el parámetro url" });
  }

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
