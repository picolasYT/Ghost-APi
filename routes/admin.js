import express from "express";
import { logs } from "../middleware/log.js";

const router = express.Router();

/* dashboard */
router.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/admin/dashboard.html");
});

/* logs */
router.get("/logs", (req, res) => {
  res.json(logs.reverse());
});

export default router;
