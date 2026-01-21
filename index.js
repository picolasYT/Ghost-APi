import express from "express";
import downloadRoutes from "./routes/downloader/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.use("/api/download", downloadRoutes);

app.listen(PORT, () => {
  console.log("👻 Ghost API online en puerto", PORT);
});
