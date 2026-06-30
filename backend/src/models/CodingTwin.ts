import mongoose from "mongoose";

const CodingTwinSchema = new mongoose.Schema(
  {
    userId:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    persona:       String, // e.g. "The Dynamic Programmer"
    strengths:     [String],
    weaknesses:    [String],
    learningStyle: String,
    archetype:     String, // e.g. "Grinder", "Sprinter", "Contest King"
    generatedAt:   Date,
  },
  { timestamps: true }
);

export default mongoose.model("CodingTwin", CodingTwinSchema);
