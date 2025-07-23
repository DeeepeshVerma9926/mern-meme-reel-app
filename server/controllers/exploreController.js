// controllers/exploreController.js
import Upload from "../models/Upload.js";

// GET /api/explore - fetch random uploads
export const getExploreUploads = async (req, res) => {
  try {
    const uploads = await Upload.aggregate([{ $sample: { size: 20 } }]); // Random 20
    res.status(200).json(uploads);
  } catch (err) {
    console.error("Explore fetch error:", err);
    res.status(500).json({ error: "Failed to fetch explore content" });
  }
};
