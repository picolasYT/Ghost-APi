import express from "express";
import "dotenv/config";
import downloadRoutes from "./routes/downloader/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

// opcional, podés dejarlo si lo usás
app.use("/files", express.static(process.cwd()));

// API
app.use("/api/download", downloadRoutes);

// health check (para UptimeRobot)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log("👻 Ghost API online en puerto", PORT);
});
