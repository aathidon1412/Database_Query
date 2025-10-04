import express from "express";
import multer from "multer";
import { uploadExcel, getLatestExcel } from "../controllers/excelControllers.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), uploadExcel);
router.get("/latest", getLatestExcel);   // new route

export default router;
