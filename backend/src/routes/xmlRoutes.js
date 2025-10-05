import express from "express";
import multer from "multer";
import { uploadXml, getLatestXml } from "../controllers/xmlControllers.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), uploadXml);
router.get("/latest", getLatestXml);

export default router;
