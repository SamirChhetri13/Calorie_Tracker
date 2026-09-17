import express from "express";
import { getDailyRecommendations } from "../controllers/recommendationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getDailyRecommendations);

export default router;
