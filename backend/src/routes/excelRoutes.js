import express from "express";
import multer from "multer";
import { uploadExcel } from "../controllers/excelControllers.js";

const router = express.Router();

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route -> /api/excel/upload
router.post("/upload", upload.single("file"), uploadExcel);

export default router;