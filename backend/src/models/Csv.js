import mongoose from "mongoose";

// Flexible schema for CSV data
const csvSchema = new mongoose.Schema(
  {
    uploadedAt: { type: Date, default: Date.now },
    batchId: { type: String, required: true },
  },
  { strict: false } // allows any fields from CSV
);

const CsvModel = mongoose.model("CsvData", csvSchema, "csv");

export default CsvModel;
