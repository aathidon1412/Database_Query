import XmlModel from "../models/Xml.js";
import { v4 as uuidv4 } from "uuid";
import { XMLParser } from "fast-xml-parser"; // npm install fast-xml-parser

export const uploadXml = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const xmlString = req.file.buffer.toString("utf8");
    const parser = new XMLParser({ ignoreAttributes: false });
    const jsonData = parser.parse(xmlString);

    if (!jsonData) return res.status(400).json({ message: "Invalid or empty XML" });

    // Flatten if it’s an array-like structure
    const rows = Array.isArray(jsonData.root?.record)
      ? jsonData.root.record
      : [jsonData.root?.record || jsonData];

    const batchId = uuidv4();
    const rowsWithMeta = rows.map(row => ({
      ...row,
      batchId,
      uploadedAt: new Date(),
    }));

    const insertResult = await XmlModel.insertMany(rowsWithMeta);
    const totalDocs = await XmlModel.estimatedDocumentCount();

    res.status(201).json({
      message: "XML data uploaded successfully",
      inserted: insertResult.length,
      totalInCollection: totalDocs,
      batchId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getLatestXml = async (req, res) => {
  try {
    const latestDoc = await XmlModel.findOne().sort({ uploadedAt: -1 });
    if (!latestDoc) return res.status(404).json({ message: "No XML data found" });

    const latestBatchId = latestDoc.batchId;
    const latestRows = await XmlModel.find(
      { batchId: latestBatchId },
      { _id: 0, batchId: 0, __v: 0, uploadedAt: 0 }
    );

    res.status(200).json({
      message: "Latest uploaded XML data fetched",
      batchId: latestBatchId,
      rows: latestRows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
