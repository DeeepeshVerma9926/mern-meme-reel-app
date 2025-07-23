// routes/userRoutes.js
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  updateProfile,
  deleteOwnUpload,
} from "../controllers/userController.js";

const router = express.Router();

// ✅ Update profile (username and/or dp)
router.put("/update", verifyToken, updateProfile);

// ✅ Delete a specific upload
router.delete("/upload/:id", verifyToken, deleteOwnUpload);


export default router;
