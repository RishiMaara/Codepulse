import mongoose from "mongoose";

const UserAnalyticsSnapshotSchema = new mongoose.Schema(
  {
    userId:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    totalSolved:     Number,
    easySolved:      Number,
    mediumSolved:    Number,
    hardSolved:      Number,
    contestRating:   Number,
    weakTopics:      [String],
    strongTopics:    [String],
    readinessScore:  Number,
    developerScore:  Number,
    companyFit: {
      Google:    Number,
      Amazon:    Number,
      Microsoft: Number,
      Atlassian: Number,
    },
    generatedAt:     { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("UserAnalyticsSnapshot", UserAnalyticsSnapshotSchema);
