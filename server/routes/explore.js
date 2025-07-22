import express from "express";
import Upload from "../models/UploadSchema.js";

const router = express.Router();

// GET /api/explore - fetch all uploads randomly
router.get("/", async (req, res) => {
  try {
    const uploads = await Upload.aggregate([{ $sample: { size: 20 } }]); // random 20 posts
    res.status(200).json(uploads);
  } catch (err) {
    console.error("Explore fetch error:", err);
    res.status(500).json({ error: "Failed to fetch explore content" });
  }
});

export default router;
