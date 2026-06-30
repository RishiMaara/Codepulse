import mongoose from "mongoose";

const ContestSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    contestName: String,
    rating:      Number,
    rank:        Number,
    attendedAt:  Date,
  },
  { timestamps: true }
);

export default mongoose.model("Contest", ContestSchema);
