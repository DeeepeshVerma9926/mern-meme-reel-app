// routes/upload.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import verifyToken from "../middleware/authMiddleware.js";
import { handleUpload, getAllUploads } from "../controllers/uploadController.js";

const router = express.Router();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer-Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "mern_uploads",
    allowed_formats: ["jpg", "jpeg", "png", "mp4"],
    resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
  }),
});

const upload = multer({ storage });

// ✅ Routes
router.post("/", verifyToken, upload.single("file"), handleUpload);
router.get("/", getAllUploads);

export default router;
