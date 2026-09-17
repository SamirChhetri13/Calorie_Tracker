import mongoose from "mongoose";
import { config } from "./env.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Error] Connection failed: ${error.message}`);
    console.warn(`[MongoDB Warning] Operating with memory/mock fallback if database is not reachable locally.`);
    // In production we exit process, but for dev robustness we handle gracefully if MongoDB server is offline
    if (config.nodeEnv === "production") {
      process.exit(1);
    }
  }
};
