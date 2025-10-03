import xlsx from "xlsx";
import ExcelModel from "../models/Excel.js";

// Upload & Save Excel
export const uploadExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Parse Excel
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (sheetData.length === 0) {
      return res.status(400).json({ message: "Excel sheet is empty" });
    }

        // Save to MongoDB
        const insertResult = await ExcelModel.insertMany(sheetData);

        // Get current document count in the collection to help verify storage
        const totalDocs = await ExcelModel.estimatedDocumentCount();

        res.status(201).json({
          message: "✅ Excel data uploaded successfully",
          inserted: insertResult.length,
          rowsInFile: sheetData.length,
          totalInCollection: totalDocs,
        });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ Server Error" });
  }
};