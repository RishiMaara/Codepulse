import { createClient } from "redis";
import { logger } from "../utils/logger";
import { env } from "./env";

export const redisClient = createClient({ url: env.REDIS_URL });

redisClient.on("error",   (err) => logger.error(`Redis error: ${err}`));
redisClient.on("connect", ()    => logger.info("✅ Redis connected"));

export const connectRedis = async (): Promise<void> => {
  await redisClient.connect();
};

/** Cache wrapper — get or set with TTL (seconds) */
export async function cached<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const hit = await redisClient.get(key);
  if (hit) return JSON.parse(hit) as T;

  const data = await fetcher();
  await redisClient.setEx(key, ttl, JSON.stringify(data));
  return data;
}
