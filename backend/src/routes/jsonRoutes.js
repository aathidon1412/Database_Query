import express from "express";
import multer from "multer";
import { uploadJson, getLatestJson } from "../controllers/jsonControllers.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), uploadJson);
router.get("/latest", getLatestJson);

export default router;
