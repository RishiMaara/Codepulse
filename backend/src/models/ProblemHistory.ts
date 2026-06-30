import mongoose from "mongoose";

export interface IProblemHistory extends mongoose.Document {
  userId:     mongoose.Types.ObjectId;
  title:      string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics:     string[];
  solvedAt:   Date;
}

const ProblemHistorySchema = new mongoose.Schema(
  {
    userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title:      { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    topics:     { type: [String], default: [] },
    solvedAt:   { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for fast per-user queries
ProblemHistorySchema.index({ userId: 1, solvedAt: -1 });
ProblemHistorySchema.index({ userId: 1, topics: 1 });

export default mongoose.model<IProblemHistory>(
  "ProblemHistory",
  ProblemHistorySchema
);
