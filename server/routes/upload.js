// routes/upload.js
import dotenv from "dotenv";
dotenv.config(); // Load .env BEFORE anything else

import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Upload from "../models/UploadSchema.js"; // ✅ Import your model

const router = express.Router();

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer Storage Setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "mern_uploads",
      allowed_formats: ["jpg", "jpeg", "png", "mp4"],
      resource_type: file.mimetype.startsWith("video/") ? "video" : "image", // Detect type
    };
  },
});

const upload = multer({ storage });

// ✅ Upload Route with DB Save
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { caption, description } = req.body;

    // Validate text fields
    if (!caption || !description) {
      return res.status(400).json({ error: "Caption and description are required." });
    }

    // Save to MongoDB
    const newUpload = new Upload({
      url: req.file.path, // Cloudinary URL
      caption,
      description,
    });

    await newUpload.save();

    res.status(201).json(newUpload);
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ✅ (Optional) GET All Uploads
router.get("/", async (req, res) => {
  try {
    const uploads = await Upload.find().sort({ createdAt: -1 });
    res.status(200).json(uploads);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
});

export default router;
