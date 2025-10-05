import JsonModel from "../models/Json.js";
import { v4 as uuidv4 } from "uuid";

export const uploadJson = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const jsonString = req.file.buffer.toString("utf8");
    let jsonData = JSON.parse(jsonString);

    if (!Array.isArray(jsonData)) jsonData = [jsonData];

    const batchId = uuidv4();
    const rowsWithMeta = jsonData.map(row => ({
      ...row,
      batchId,
      uploadedAt: new Date(),
    }));

    const insertResult = await JsonModel.insertMany(rowsWithMeta);
    const totalDocs = await JsonModel.estimatedDocumentCount();

    res.status(201).json({
      message: "JSON data uploaded successfully",
      inserted: insertResult.length,
      totalInCollection: totalDocs,
      batchId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getLatestJson = async (req, res) => {
  try {
    const latestDoc = await JsonModel.findOne().sort({ uploadedAt: -1 });
    if (!latestDoc) return res.status(404).json({ message: "No JSON data found" });

    const latestBatchId = latestDoc.batchId;
    const latestRows = await JsonModel.find(
      { batchId: latestBatchId },
      { _id: 0, batchId: 0, __v: 0, uploadedAt: 0 }
    );

    res.status(200).json({
      message: "Latest uploaded JSON data fetched",
      batchId: latestBatchId,
      rows: latestRows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
