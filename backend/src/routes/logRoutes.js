import express from "express";
import {
  logMeal,
  getMealLogsByDate,
  deleteMealLogItem,
  logExercise,
  getExerciseLogs,
  deleteExerciseLog,
  getDailySummary,
} from "../controllers/logController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validatePayload } from "../middlewares/validationMiddleware.js";
import { mealLogSchema, exerciseLogSchema } from "../validators/logValidator.js";

const router = express.Router();

router.use(protect);

// Summary API
router.get("/summary", getDailySummary);

// Meal Logging
router.post("/meals", validatePayload(mealLogSchema), logMeal);
router.get("/meals", getMealLogsByDate);
router.delete("/meals/:logId/items/:itemId", deleteMealLogItem);

// Exercise Logging
router.post("/exercise", validatePayload(exerciseLogSchema), logExercise);
router.get("/exercise", getExerciseLogs);
router.delete("/exercise/:id", deleteExerciseLog);

export default router;
