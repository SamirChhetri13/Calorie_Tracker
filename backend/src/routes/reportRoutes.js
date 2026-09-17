import express from "express";
import { getCalorieTrends, getMacroDistribution, getWeightTrends } from "../controllers/reportController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/calorie-trends", getCalorieTrends);
router.get("/macro-distribution", getMacroDistribution);
router.get("/weight-trends", getWeightTrends);

export default router;
