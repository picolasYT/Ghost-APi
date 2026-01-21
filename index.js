import express from "express";
import apiRoutes from "./routes/index.js";
import auth from "./routes/middleware/auth.js";
import rateLimit from "./routes/middleware/rateLimit.js";
import logRequest from "./routes/middleware/log.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.use("/api/download", auth, rateLimit, logRequest, apiRoutes);

app.listen(PORT, () => {
  console.log("👻 Ghost API online en puerto", PORT);
});
