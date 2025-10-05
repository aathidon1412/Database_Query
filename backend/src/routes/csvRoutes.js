import express from "express";
import multer from "multer";
import { uploadCsv, getLatestCsv } from "../controllers/csvControllers.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), uploadCsv);
router.get("/latest", getLatestCsv);

export default router;
