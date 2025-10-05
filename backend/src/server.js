import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import excelRoutes from "./routes/excelRoutes.js";
import csvRoutes from "./routes/csvRoutes.js"; // <-- NEW

dotenv.config();

const app = express();

// Improved CORS
app.use(
  cors({
    origin: ["http://localhost:5173"], // frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/excel", excelRoutes);
app.use("/api/csv", csvRoutes); // <-- NEW

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
