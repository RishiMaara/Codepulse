import rateLimit from "express-rate-limit";
import { env } from "../config/env";

/** General API rate limiter: 100 requests per 15 min */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});

/** Strict limiter for auth routes: 10 requests per 15 min */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many auth attempts, please slow down." },
});

/** Heavy sync endpoints */
export const syncLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: env.NODE_ENV === "development" ? 30 : 5,
  message: { success: false, message: "Sync limit reached. Please wait before syncing again." },
});
