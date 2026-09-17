import express from "express";
import { register, login, logout, refreshToken, getMe } from "../controllers/authController.js";
import { validatePayload } from "../middlewares/validationMiddleware.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", validatePayload(registerSchema), register);
router.post("/login", validatePayload(loginSchema), login);
router.post("/refresh", refreshToken);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;
