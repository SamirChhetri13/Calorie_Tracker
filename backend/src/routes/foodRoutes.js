import express from "express";
import {
  createFoodItem,
  getFoodItems,
  getFoodItemById,
  updateFoodItem,
  deleteFoodItem,
} from "../controllers/foodController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validatePayload } from "../middlewares/validationMiddleware.js";
import { foodItemSchema } from "../validators/foodValidator.js";

const router = express.Router();

router.use(protect);

router.post("/", validatePayload(foodItemSchema), createFoodItem);
router.get("/", getFoodItems);
router.get("/:id", getFoodItemById);
router.put("/:id", updateFoodItem);
router.delete("/:id", deleteFoodItem);

export default router;
