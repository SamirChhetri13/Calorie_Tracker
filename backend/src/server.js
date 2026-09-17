import app from "./app.js";
import { config } from "./config/env.js";
import { connectDB } from "./config/db.js";

const startServer = async () => {
  // Connect DB
  await connectDB();

  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`[NutriPulse Backend] Server listening on port ${PORT} in ${config.nodeEnv} mode`);
    console.log(`[NutriPulse Backend] Health check available at http://localhost:${PORT}/api/health`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
