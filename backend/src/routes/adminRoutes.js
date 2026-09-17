import express from "express";
import { getUsers, updateUserRole, getAuditLogs, getSystemMetrics } from "../controllers/adminController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, restrictTo("ADMIN"));

router.get("/users", getUsers);
router.put("/users/:id/role", updateUserRole);
router.get("/audit-logs", getAuditLogs);
router.get("/metrics", getSystemMetrics);

export default router;
