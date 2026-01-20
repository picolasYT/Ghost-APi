import express from "express";
import apiRoutes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));
app.use("/files", express.static(process.cwd()));

app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log("👻 Ghost API online en puerto", PORT);
});
