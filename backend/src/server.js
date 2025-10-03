import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import connectDB from "./config/db.js";
import excelRoutes from "./routes/excelRoutes.js";

dotenv.config();

const app = express();

//Improved CORS: allow multiple origins easily if needed later
app.use(cors({
  origin: ["http://localhost:5173"], // add frontend URLs here
  methods: ["GET", "POST"],
  credentials: true
}));

//Connect MongoDB
connectDB();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // in case you add form-data later

//Routes
app.use("/api/excel", excelRoutes);

//Default route (optional health check)
app.get("/", (req, res) => {
  res.send("API is running...");
});

//Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
