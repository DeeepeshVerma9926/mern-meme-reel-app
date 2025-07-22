// routes/protectedRoutes.js
import express from "express";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Sample protected route
router.get("/dashboard", verifyToken, (req, res) => {
  res.status(200).json({
    message: "You have accessed a protected dashboard route.",
    user: req.user,
  });
});

export default router;
