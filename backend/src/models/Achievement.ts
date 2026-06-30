import mongoose from "mongoose";

const BADGES = [
  "first_solve",
  "ten_problems",
  "hundred_problems",
  "five_hundred_problems",
  "thirty_day_streak",
  "top_10_percent",
  "contest_debut",
  "github_connected",
] as const;

export type BadgeType = (typeof BADGES)[number];

const AchievementSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    badge:    { type: String, enum: BADGES, required: true },
    earnedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

AchievementSchema.index({ userId: 1, badge: 1 }, { unique: true });

export { BADGES };
export default mongoose.model("Achievement", AchievementSchema);
