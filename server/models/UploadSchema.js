// models/Upload.js
import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Upload", uploadSchema); // Collection name will be "uploads"
