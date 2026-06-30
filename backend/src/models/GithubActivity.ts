import mongoose from "mongoose";

const GithubSchema = new mongoose.Schema(
  {
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    repositories: Number,
    commits:      Number,
    stars:        Number,
    languages:    Object,
  },
  { timestamps: true }
);

export default mongoose.model("GithubActivity", GithubSchema);
