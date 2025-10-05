import mongoose from "mongoose";

const tsvSchema = new mongoose.Schema(
  {
    uploadedAt: { type: Date, default: Date.now },
    batchId: { type: String, required: true },
  },
  { strict: false }
);

const TsvModel = mongoose.model("TsvData", tsvSchema, "tsv");

export default TsvModel;
