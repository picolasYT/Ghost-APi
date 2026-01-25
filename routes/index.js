import express from "express";
import tiktok from "./downloader/tiktok.js";
import instagram from "./downloader/instagram.js";
import youtube from "./downloader/youtube.js";
import adminRoutes from "./routes/admin.js";

const router = express.Router();

router.use("/download/tiktok", tiktok);
router.use("/download/instagram", instagram);
router.use("/download/youtube", youtube);
app.use("/admin", adminRoutes);

export default router;
