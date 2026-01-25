import express from "express";
import adminRoutes from "./admin.js";
import tiktok from "./downloader/tiktok.js";
import instagram from "./downloader/instagram.js";
import youtube from "./downloader/youtube.js";

const router = express.Router();

router.use("/download/tiktok", tiktok);
router.use("/download/instagram", instagram);
router.use("/download/youtube", youtube);

router.use("/admin", adminRoutes); // SOLO API

export default router;
