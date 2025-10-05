import mongoose from "mongoose";

const xmlSchema = new mongoose.Schema(
  {
    uploadedAt: { type: Date, default: Date.now },
    batchId: { type: String, required: true },
  },
  { strict: false }
);

const XmlModel = mongoose.model("XmlData", xmlSchema, "xml");

export default XmlModel;
