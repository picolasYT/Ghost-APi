import express from "express";
import youtube from "./downloader/youtube.js";
import tiktok from "./downloader/tiktok.js";

const router = express.Router();

router.use("/download/youtube", youtube);
router.use("/download/tiktok", tiktok);

export default router;
