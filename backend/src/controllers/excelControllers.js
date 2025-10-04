import xlsx from "xlsx";
import ExcelModel from "../models/Excel.js";
import { v4 as uuidv4 } from "uuid";  // npm install uuid

// Upload & Save Excel
export const uploadExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (sheetData.length === 0) {
      return res.status(400).json({ message: "Excel sheet is empty" });
    }

    // Add batchId to each row
    const batchId = uuidv4();
    const rowsWithMeta = sheetData.map(row => ({
      ...row,
      batchId,
      uploadedAt: new Date()
    }));

    // Save to MongoDB
    const insertResult = await ExcelModel.insertMany(rowsWithMeta);

    const totalDocs = await ExcelModel.estimatedDocumentCount();

    res.status(201).json({
      message: "Excel data uploaded successfully",
      inserted: insertResult.length,
      rowsInFile: sheetData.length,
      totalInCollection: totalDocs,
      batchId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get latest uploaded Excel data
export const getLatestExcel = async (req, res) => {
  try {
    // Find the latest batchId
    const latestDoc = await ExcelModel.findOne().sort({ uploadedAt: -1 });
    if (!latestDoc) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const latestBatchId = latestDoc.batchId;

    // Fetch all rows with that batchId but exclude unwanted fields
    const latestRows = await ExcelModel.find(
      { batchId: latestBatchId },
      { _id: 0, batchId: 0, __v: 0, uploadedAt: 0 }   // exclude meta fields
    );

    res.status(200).json({
      message: "Latest uploaded Excel data fetched",
      batchId: latestBatchId,
      rows: latestRows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


