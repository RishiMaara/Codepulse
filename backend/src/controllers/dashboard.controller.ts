import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import User from "../models/User";
import GithubActivity from "../models/GithubActivity";
import LeetcodeStats from "../models/LeetcodeStats";
import UserAnalyticsSnapshot from "../models/UserAnalyticsSnapshot";
import Achievement from "../models/Achievement";

export const getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const [user, github, leetcode, snapshot, achievements] = await Promise.all([
      User.findById(userId).select("-__v"),
      GithubActivity.findOne({ userId }),
      LeetcodeStats.findOne({ userId }),
      UserAnalyticsSnapshot.findOne({ userId }).sort({ generatedAt: -1 }),
      Achievement.find({ userId }).sort({ earnedAt: -1 }),
    ]);

    res.json({
      success: true,
      data: { user, github, leetcode, snapshot, achievements },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
