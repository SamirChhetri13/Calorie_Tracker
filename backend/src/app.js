import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config/env.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

// Routes Imports
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: [config.clientUrl, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/foods", foodRoutes);
app.use("/api/v1/logs", logRoutes);
app.use("/api/v1/recommendations", recommendationRoutes);
app.use("/api/v1/progress", progressRoutes);
app.use("/api/v1/analytics", reportRoutes);
app.use("/api/v1/admin", adminRoutes);

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NutriPulse API is running smoothly",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// Root API route
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    name: "NutriPulse API",
    version: "1.0.0",
    docs: "/api/health",
  });
});

// Fallback Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
