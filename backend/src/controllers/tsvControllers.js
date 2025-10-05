import TsvModel from "../models/Tsv.js";
import { v4 as uuidv4 } from "uuid";

// Upload & Save TSV
export const uploadTsv = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const tsvString = req.file.buffer.toString("utf8");
    const lines = tsvString.trim().split("\n");
    const headers = lines[0].split("\t");

    const data = lines.slice(1).map(line => {
      const values = line.split("\t");
      const row = {};
      headers.forEach((header, i) => {
        row[header.trim()] = values[i]?.trim() || "";
      });
      return row;
    });

    if (data.length === 0) {
      return res.status(400).json({ message: "TSV file is empty" });
    }

    const batchId = uuidv4();
    const rowsWithMeta = data.map(row => ({
      ...row,
      batchId,
      uploadedAt: new Date(),
    }));

    const insertResult = await TsvModel.insertMany(rowsWithMeta);
    const totalDocs = await TsvModel.estimatedDocumentCount();

    res.status(201).json({
      message: "TSV data uploaded successfully",
      inserted: insertResult.length,
      rowsInFile: data.length,
      totalInCollection: totalDocs,
      batchId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get latest TSV
export const getLatestTsv = async (req, res) => {
  try {
    const latestDoc = await TsvModel.findOne().sort({ uploadedAt: -1 });
    if (!latestDoc) return res.status(404).json({ message: "No TSV data found" });

    const latestBatchId = latestDoc.batchId;
    const latestRows = await TsvModel.find(
      { batchId: latestBatchId },
      { _id: 0, batchId: 0, __v: 0, uploadedAt: 0 }
    );

    res.status(200).json({
      message: "Latest uploaded TSV data fetched",
      batchId: latestBatchId,
      rows: latestRows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
