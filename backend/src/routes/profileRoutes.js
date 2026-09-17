import express from "express";
import { createOrUpdateProfile, getProfile } from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validatePayload } from "../middlewares/validationMiddleware.js";
import { profileSchema } from "../validators/profileValidator.js";

const router = express.Router();

router.use(protect);

router.post("/", validatePayload(profileSchema), createOrUpdateProfile);
router.get("/", getProfile);

export default router;
