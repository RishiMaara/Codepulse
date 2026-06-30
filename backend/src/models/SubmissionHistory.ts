import mongoose from "mongoose";

const SubmissionHistorySchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    problemSlug: { type: String, required: true },
    title:       { type: String, required: true },
    difficulty:  { type: String, enum: ["Easy", "Medium", "Hard"] },
    topics:      { type: [String], default: [] },
    timestamp:   { type: Date, default: Date.now },
  },
  { timestamps: true }
);

SubmissionHistorySchema.index({ userId: 1, timestamp: -1 });
SubmissionHistorySchema.index({ userId: 1, topics: 1 });

export default mongoose.model("SubmissionHistory", SubmissionHistorySchema);
