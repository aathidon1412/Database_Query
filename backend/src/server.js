import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import connectDB from "./config/db.js";
import excelRoutes from "./routes/excelRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // allow only your frontend
  methods: ["GET", "POST"],        // allowed methods
  credentials: true
}));

// Connect DB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/excel", excelRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));