import mongoose from "mongoose";

// Flexible schema (any Excel columns can be stored). Use explicit collection name 'excel'.
const excelSchema = new mongoose.Schema({}, { strict: false });

// Model name is ExcelData but use collection 'excel' so MongoDB collection is exactly as required
const ExcelModel = mongoose.model("ExcelData", excelSchema, "excel");

export default ExcelModel;