import express from "express";
import youtube from "./downloader/youtube.js";
import tiktok from "./downloader/tiktok.js";
import instagram from "./downloader/instagram.js";

const router = express.Router();

router.use("/download/youtube", youtube);
router.use("/download/tiktok", tiktok);
router.use("/download/instagram", instagram);

export default router;
