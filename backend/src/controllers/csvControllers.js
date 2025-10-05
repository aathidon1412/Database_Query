import CsvModel from "../models/Csv.js";
import csv from "csvtojson"; // npm install csvtojson
import { v4 as uuidv4 } from "uuid";

// Upload & Save CSV
export const uploadCsv = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Convert CSV buffer to JSON
    const csvString = req.file.buffer.toString("utf8");
    const csvData = await csv().fromString(csvString);

    if (csvData.length === 0) {
      return res.status(400).json({ message: "CSV file is empty" });
    }

    const batchId = uuidv4();
    const rowsWithMeta = csvData.map((row) => ({
      ...row,
      batchId,
      uploadedAt: new Date(),
    }));

    const insertResult = await CsvModel.insertMany(rowsWithMeta);

    const totalDocs = await CsvModel.estimatedDocumentCount();

    res.status(201).json({
      message: "CSV data uploaded successfully",
      inserted: insertResult.length,
      rowsInFile: csvData.length,
      totalInCollection: totalDocs,
      batchId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get latest uploaded CSV data
export const getLatestCsv = async (req, res) => {
  try {
    const latestDoc = await CsvModel.findOne().sort({ uploadedAt: -1 });
    if (!latestDoc) {
      return res.status(404).json({ message: "No CSV data found" });
    }

    const latestBatchId = latestDoc.batchId;

    const latestRows = await CsvModel.find(
      { batchId: latestBatchId },
      { _id: 0, batchId: 0, __v: 0, uploadedAt: 0 }
    );

    res.status(200).json({
      message: "Latest uploaded CSV data fetched",
      batchId: latestBatchId,
      rows: latestRows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
