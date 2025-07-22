// routes/dashboard.js
import express from "express";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  res.status(200).json({
    message: `Welcome to your dashboard, user ID: ${req.user.id}`,
    user: req.user,
  });
});

export default router;
