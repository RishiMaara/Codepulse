import "dotenv/config";
import { createApp } from "./app";
import { connectDB } from "./config/db";
import { startSyncJob } from "./jobs/sync.job";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const boot = async (): Promise<void> => {
  // Connect DB
  await connectDB();

  // Start express
  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info(`🚀 CodePulse API running on http://localhost:${env.PORT}`);
    logger.info(`📡 Environment: ${env.NODE_ENV}`);
  });

  // Start cron jobs
  startSyncJob();
};

boot().catch((err) => {
  logger.error(`Fatal startup error: ${err.message}`);
  process.exit(1);
});
