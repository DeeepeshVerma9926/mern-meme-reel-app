// routes/dashboard.js
import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { getDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

// Protected dashboard route
router.get("/", verifyToken, getDashboard);

export default router;
