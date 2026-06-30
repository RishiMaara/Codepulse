import dotenv from "dotenv";
dotenv.config();

interface Env {
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  CLIENT_URL: string;
  REDIS_URL: string;
  AI_SERVICE_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_TOKEN: string;
  SENDGRID_API_KEY: string;
  GEMINI_API_KEY: string;
  NODE_ENV: "development" | "production" | "test";
  USE_MEMORY_DB: boolean;
}

const getEnv = (): Env => {
  const required = ["MONGO_URI", "JWT_SECRET"];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required env variable: ${key}`);
    }
  }

  return {
    PORT:                  parseInt(process.env.PORT || "5000", 10),
    MONGO_URI:             process.env.MONGO_URI!,
    JWT_SECRET:            process.env.JWT_SECRET!,
    JWT_REFRESH_SECRET:    process.env.JWT_REFRESH_SECRET || "refresh_secret",
    CLIENT_URL:            process.env.CLIENT_URL || "http://localhost:5173",
    REDIS_URL:             process.env.REDIS_URL || "redis://localhost:6379",
    AI_SERVICE_URL:        process.env.AI_SERVICE_URL || "http://localhost:8000",
    GOOGLE_CLIENT_ID:      process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET:  process.env.GOOGLE_CLIENT_SECRET || "",
    GITHUB_CLIENT_ID:      process.env.GITHUB_CLIENT_ID || "",
    GITHUB_CLIENT_SECRET:  process.env.GITHUB_CLIENT_SECRET || "",
    GITHUB_TOKEN:          process.env.GITHUB_TOKEN || "",
    SENDGRID_API_KEY:      process.env.SENDGRID_API_KEY || "",
    GEMINI_API_KEY:        process.env.GEMINI_API_KEY || "",
    NODE_ENV:              (process.env.NODE_ENV as Env["NODE_ENV"]) || "development",
    USE_MEMORY_DB:         process.env.USE_MEMORY_DB === "true",
  };
};

export const env = getEnv();
