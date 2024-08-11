import redis from "redis";
import {
  convertToGzipFormat,
  decompressFromGzipFormat,
} from "../../utils/zip.ts";

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "",
});
redisClient.connect();

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", err => {
  console.error("Redis connection error:", err);
});

export async function storeInRedis(key: string, value: object, time: number) {
  const compressedValue = convertToGzipFormat(value);
  await redisClient.set(key, compressedValue, {
    EX: time,
  });
}

export async function getFromRedis(key: string) {
  const compressedValue = await redisClient.get(key);
  if (compressedValue) {
    return decompressFromGzipFormat(compressedValue);
  }
  return null;
}

export async function getAndStoreInRedis(
  key: string,
  time: number,
  getData: () => Promise<object>,
) {
  console.log("Checking from Redis for " + key);
  const cachedData = await getFromRedis(key);
  if (cachedData) {
    return cachedData;
  }
  const data = await getData();
  await storeInRedis(key, data, time);
  return data;
}

export function closeRedisClient() {
  redisClient.quit();
}

export default redisClient;
