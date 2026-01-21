import { Router } from "express";
import tiktok from "./tiktok.js";
import instagram from "./instagram.js";
import youtube from "./youtube.js";

const router = Router();

router.get("/tiktok", tiktok);
router.get("/instagram", instagram);
router.get("/youtube", youtube);

export default router;
