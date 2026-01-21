import express from "express";

import tiktok from "./downloader/tiktok.js";
import instagram from "./downloader/instagram.js";
import youtube from "./downloader/youtube.js";
import authLogin from "./auth/login.js";
import authRegister from "./auth/register.js";
import authMe from "./auth/me.js";
import adminStats from "./admin/stats.js";
import adminUsers from "./admin/users.js";
import adminLogs from "./admin/logs.js";

const router = express.Router();

router.use("/download/tiktok", tiktok);
router.use("/download/instagram", instagram);
router.use("/download/youtube", youtube);
router.use("/auth/login", authLogin);
router.use("/auth/register", authRegister);
router.use("/auth/me", authMe);
router.use("/admin/stats", adminStats);
router.use("/admin/users", adminUsers);
router.use("/admin/logs", adminLogs);

export default router;
