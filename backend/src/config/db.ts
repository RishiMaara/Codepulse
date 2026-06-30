import mongoose from "mongoose";
import { logger } from "../utils/logger";
import { env } from "./env";
import User from "../models/User";

const MONGO_OPTIONS: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 15_000,
  connectTimeoutMS: 15_000,
  socketTimeoutMS: 45_000,
  maxPoolSize: 10,
  minPoolSize: 1,
  retryWrites: true,
  w: "majority",
  family: 4,
};

async function verifyConnection(): Promise<void> {
  if (!mongoose.connection.db) {
    throw new Error("MongoDB connected but database handle is missing");
  }
  await mongoose.connection.db.admin().command({ ping: 1 });
  // Real query — catches Atlas connections that ping but drop on use
  await User.findOne().limit(1).lean();
}

async function connectWithRetries(uri: string, attempts = 3): Promise<void> {
  let lastError: Error | null = null;

  for (let i = 1; i <= attempts; i++) {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      const conn = await mongoose.connect(uri, MONGO_OPTIONS);
      await verifyConnection();
      logger.info(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      logger.warn(`MongoDB attempt ${i}/${attempts} failed: ${lastError.message}`);
      if (i < attempts) {
        await new Promise((r) => setTimeout(r, 2000 * i));
      }
    }
  }

  throw lastError ?? new Error("MongoDB connection failed");
}

async function connectMemoryDB(): Promise<void> {
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  const mem = await MongoMemoryServer.create({
    instance: { launchTimeout: 120_000 },
  });
  const uri = mem.getUri("codepulse");
  process.env.MONGO_URI = uri;

  const conn = await mongoose.connect(uri, MONGO_OPTIONS);
  await verifyConnection();
  logger.warn("⚠️  Using in-memory MongoDB (data resets on restart)");
  logger.warn("   To use Atlas: whitelist your IP in MongoDB Atlas → Network Access");
  logger.warn("   Then set USE_MEMORY_DB=false in backend/.env");
  logger.info(`✅ In-memory MongoDB ready: ${conn.connection.host}`);
}

function registerConnectionHandlers(): void {
  mongoose.connection.on("disconnected", () => {
    logger.error("MongoDB disconnected — auth and data requests will fail until restart");
  });
  mongoose.connection.on("error", (err) => {
    logger.error(`MongoDB connection error: ${err.message}`);
  });
}

export const connectDB = async (): Promise<void> => {
  registerConnectionHandlers();

  if (env.USE_MEMORY_DB) {
    await connectMemoryDB();
    return;
  }

  try {
    await connectWithRetries(env.MONGO_URI);
  } catch (atlasError: unknown) {
    const msg = atlasError instanceof Error ? atlasError.message : String(atlasError);
    logger.error(`❌ MongoDB Atlas connection failed: ${msg}`);

    if (env.NODE_ENV === "development") {
      logger.warn("Falling back to in-memory database for local development...");
      await connectMemoryDB();
      return;
    }

    logger.error(
      "Atlas fix: Network Access → add your IP (or 0.0.0.0/0 for dev). Ensure cluster is not paused."
    );
    process.exit(1);
  }
};

export const isDBConnected = (): boolean => mongoose.connection.readyState === 1;
