// routes/explore.js
import express from "express";
import { getExploreUploads } from "../controllers/exploreController.js";

const router = express.Router();

router.get("/", getExploreUploads);

export default router;
