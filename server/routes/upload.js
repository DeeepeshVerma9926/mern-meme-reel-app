// routes/upload.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Upload from "../models/UploadSchema.js"; // ✅ Make sure path is correct

const router = express.Router();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "mern_uploads",
    allowed_formats: ["jpg", "jpeg", "png", "mp4"],
    resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
  }),
});

const upload = multer({ storage });

// ✅ Final Working Upload Route
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { caption, description } = req.body;

    if (!req.file || !caption || !description) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const newUpload = new Upload({
      url: req.file.path,       // Cloudinary file URL
      caption,
      description,
    });

    await newUpload.save(); // ✅ Save to MongoDB

    res.status(201).json({ message: "Upload saved to MongoDB", data: newUpload });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
