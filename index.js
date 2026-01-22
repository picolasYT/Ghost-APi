import express from "express";
import apiRoutes from "./routes/index.js";
import auth from "./middleware/auth.js";
import rateLimit from "./middleware/rateLimit.js";
import logRequest from "./middleware/log.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.use("/api/download", auth, rateLimit, logRequest, apiRoutes);

app.listen(PORT, () => {
  console.log("👻 Ghost API online en puerto", PORT);
});
