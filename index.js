import express from "express";
import "dotenv/config";
import downloadRoutes from "./routes/downloader/index.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/api/download", downloadRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(process.env.PORT || 3000);
