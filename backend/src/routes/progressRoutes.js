import express from "express";
import { logProgress, getProgressHistory, deleteProgressLog } from "../controllers/progressController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", logProgress);
router.get("/", getProgressHistory);
router.delete("/:id", deleteProgressLog);

export default router;
