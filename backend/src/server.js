import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import excelRoutes from "./routes/excelRoutes.js";
import csvRoutes from "./routes/csvRoutes.js";
import tsvRoutes from "./routes/tsvRoutes.js";
import xmlRoutes from "./routes/xmlRoutes.js";
import jsonRoutes from "./routes/jsonRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use("/api/excel", excelRoutes);
app.use("/api/csv", csvRoutes);
app.use("/api/tsv", tsvRoutes);
app.use("/api/xml", xmlRoutes);
app.use("/api/json", jsonRoutes);

app.get("/", (req, res) => {
  res.send("Universal File Upload API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
