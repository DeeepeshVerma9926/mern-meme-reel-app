// server/controllers/userController.js
import User from "../models/User.js";
import Upload from "../models/Upload.js";
import { v2 as cloudinary } from "cloudinary"; // 👈 Use cloudinary directly
import dotenv from "dotenv";
dotenv.config();

// 👇 Configure Cloudinary again
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Update Profile (name + profilePic)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, base64Image } = req.body;

    const updateFields = {};
    if (username) updateFields.username = username;

    if (base64Image) {
      // 👇 Upload image to cloudinary
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "mern_uploads/profile_pics",
      });
      updateFields.profilePic = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    );

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Failed to update", error: err.message });
  }
};

// ✅ Delete User's Own Post
export const deleteOwnUpload = async (req, res) => {
  try {
    const userId = req.user.id;
    const uploadId = req.params.id;

    const upload = await Upload.findById(uploadId);
    if (!upload) return res.status(404).json({ message: "Post not found" });

    if (upload.uploader.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    await Upload.findByIdAndDelete(uploadId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
