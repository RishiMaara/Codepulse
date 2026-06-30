import mongoose from "mongoose";

const LeetcodeStatsSchema = new mongoose.Schema(
  {
    userId:         { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    totalSolved:    Number,
    easySolved:     Number,
    mediumSolved:   Number,
    hardSolved:     Number,
    ranking:        Number,
    acceptanceRate: Number,
    contestRating:  Number,
    streak:         Number,
  },
  { timestamps: true }
);

export default mongoose.model("LeetcodeStats", LeetcodeStatsSchema);
