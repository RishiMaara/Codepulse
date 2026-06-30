import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { syncLimiter } from "../middleware/rateLimit.middleware";
import {
  syncLeetcode,
  getLeetcodeStats,
  syncGithub,
  getLeaderboard,
  getPublicProfile,
  updateProfile,
} from "../controllers/user.controller";

const router = Router();

// LeetCode
router.post("/leetcode/sync", protect, syncLimiter, syncLeetcode);
router.get("/leetcode/stats",  protect, getLeetcodeStats);

// GitHub
router.post("/github/sync", protect, syncLimiter, syncGithub);

// Leaderboard (public)
router.get("/leaderboard", getLeaderboard);

// Public Profile (public)
router.get("/u/:username", getPublicProfile);

// Update profile (protected)
router.put("/profile", protect, updateProfile);

export default router;
