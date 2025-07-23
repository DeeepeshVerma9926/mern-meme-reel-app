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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // 👈 Refers to the User model
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Upload", uploadSchema);
