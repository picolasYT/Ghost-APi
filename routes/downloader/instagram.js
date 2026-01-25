import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    platform: "instagram",
    status: "maintenance",
    message: "Instagram downloader está temporalmente deshabilitado"
  });
});

export default router;
