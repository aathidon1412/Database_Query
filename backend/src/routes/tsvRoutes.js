import express from "express";
import multer from "multer";
import { uploadTsv, getLatestTsv } from "../controllers/tsvControllers.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), uploadTsv);
router.get("/latest", getLatestTsv);

export default router;
