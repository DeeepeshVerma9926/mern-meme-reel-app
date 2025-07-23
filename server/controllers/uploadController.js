// controllers/uploadController.js
import Upload from "../models/Upload.js";

// @desc Upload a new meme or reel
export const handleUpload = async (req, res) => {
  try {
    const { caption, description } = req.body;

    if (!caption || !description) {
      return res.status(400).json({ error: "Caption and description are required." });
    }

    const newUpload = new Upload({
      url: req.file.path,
      caption,
      description,
      user: req.user._id, // uploader ID from JWT
    });

    await newUpload.save();
    res.status(201).json(newUpload);
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
};

// @desc Get all uploads
export const getAllUploads = async (req, res) => {
  try {
    const uploads = await Upload.find()
      .populate("user", "username email") // populate uploader info
      .sort({ createdAt: -1 });

    res.status(200).json(uploads);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
};
