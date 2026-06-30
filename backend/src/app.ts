import express from "express";
import cors from "cors";
import helmet from "helmet";
import { apiLimiter } from "./middleware/rateLimit.middleware";
import { errorHandler, notFound } from "./middleware/error.middleware";

// Routes
import authRoutes      from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import userRoutes      from "./routes/user.routes";
import aiRoutes        from "./routes/ai.routes";

import { env } from "./config/env";
import { isDBConnected } from "./config/db";

export const createApp = (): express.Application => {
  const app = express();

  // ─── Security ─────────────────────────────────────────────────────────────
  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));

  // ─── Body Parsing ─────────────────────────────────────────────────────────
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true }));

  // ─── Rate Limiting ────────────────────────────────────────────────────────
  app.use("/api", apiLimiter);

  // ─── Health Check ─────────────────────────────────────────────────────────
  app.get("/health", (_req, res) =>
    res.json({
      status: isDBConnected() ? "ok" : "degraded",
      database: isDBConnected() ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
      service: "CodePulse API",
    })
  );

  // ─── API Routes ───────────────────────────────────────────────────────────
  app.use("/api/auth",      authRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/user",      userRoutes);
  app.use("/api/ai",        aiRoutes);

  // ─── Error Handling ───────────────────────────────────────────────────────
  app.use(notFound);
  app.use(errorHandler);

  return app;
};
