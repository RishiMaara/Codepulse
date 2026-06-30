import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  avatar?: string;
  leetcodeUsername?: string;
  githubUsername?: string;
  developerScore: number;
  role: string;
}

const UserSchema = new mongoose.Schema(
  {
    name:             { type: String, required: true },
    email:            { type: String, unique: true, required: true },
    avatar:           String,
    leetcodeUsername: String,
    githubUsername:   String,
    developerScore:   { type: Number, default: 0 },
    role:             { type: String, default: "user" },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
