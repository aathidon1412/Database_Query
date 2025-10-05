import mongoose from "mongoose";

const jsonSchema = new mongoose.Schema(
  {
    uploadedAt: { type: Date, default: Date.now },
    batchId: { type: String, required: true },
  },
  { strict: false }
);

const JsonModel = mongoose.model("JsonData", jsonSchema, "json");

export default JsonModel;
