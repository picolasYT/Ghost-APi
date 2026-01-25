import express from "express";
import apiRoutes from "./routes/index.js";
import logRequest from "./middleware/log.js";
import adminRoutes from "./routes/admin.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/* API pública */
app.use("/api", logRequest, apiRoutes);

/* Panel admin */
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  console.log("👻 Ghost API online en puerto", PORT);
});
