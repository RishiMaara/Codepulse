import mongoose from "mongoose";

const WeeklyReportSchema = new mongoose.Schema(
  {
    userId:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    weekStart:       Date,
    weekEnd:         Date,
    problemsSolved:  Number,
    ratingChange:    Number,
    newAchievements: [String],
    weakTopics:      [String],
    recommendations: [String],
    pdfUrl:          String,
    emailSent:       { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("WeeklyReport", WeeklyReportSchema);
