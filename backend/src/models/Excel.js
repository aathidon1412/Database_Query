import mongoose from "mongoose";

// Flexible schema (any Excel columns can be stored). Add extra metadata fields.
const excelSchema = new mongoose.Schema(
  {
    uploadedAt: { type: Date, default: Date.now }, // timestamp of upload
    batchId: { type: String, required: true }      // unique batch tag
  },
  { strict: false }
);

const ExcelModel = mongoose.model("ExcelData", excelSchema, "excel");

export default ExcelModel;
