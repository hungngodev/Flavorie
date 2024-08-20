import { convertToGzipFormat, decompressFromGzipFormat } from "@src/utils/zip";
import { Redis } from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL || "");

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", err => {
  console.error("Redis connection error:", err);
});

export async function storeInRedis(
  key: string,
  value: object,
  time: number | null,
) {
  const compressedValue = convertToGzipFormat(value);
  if (time === null) {
    await redisClient.set(key, compressedValue);
    return;
  }
  await redisClient.set(key, compressedValue, "EX", time);
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
  time: number | null,
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
interface RedisStreamMessage {
  [key: string]: string;
}
type RedisStreamEntry = [string, string[]];
type RedisStreamResponse = [string, RedisStreamEntry[]];

// Function to listen to Redis Stream
export async function listenToRedisStream(
  streamName: string,
  groupName: string,
  consumerName: string,
) {
  try {
    // Create the consumer group if it doesn't exist
    try {
      await redisClient.xgroup(
        "CREATE",
        streamName,
        groupName,
        "$",
        "MKSTREAM",
      );
    } catch (err) {
      if (!(err instanceof Error) || !err.message.includes("BUSYGROUP")) {
        throw err;
      }
    }

    // Function to read from the stream
    const processStream = async () => {
      try {
        const messages = await redisClient.xreadgroup(
          "GROUP",
          groupName,
          consumerName,
          "COUNT",
          1, // Process up to 10 messages at a time
          "BLOCK",
          0, // Block indefinitely until a new message arrives
          "STREAMS",
          streamName,
          ">",
        );

        if (messages) {
          const [stream, entries] = messages[0] as RedisStreamResponse;
          entries.forEach(([id, fields]: [string, string[]]) => {
            const data: RedisStreamMessage = {};
            for (let i = 0; i < fields.length; i += 2) {
              data[fields[i]] = fields[i + 1];
            }
            console.log(`Received new message from stream ${stream}:`, data);

            // Process the message here
            handleNewStreamMessage(data);

            // Acknowledge the message
            redisClient.xack(streamName, groupName, id);
          });
        }
      } catch (err) {
        console.error("Error processing Redis stream:", err);
      }

      // Continue listening for the next messages
      setImmediate(processStream);
    };

    processStream(); // Start the listener
  } catch (err) {
    console.error("Error setting up Redis stream listener:", err);
  }
}

// Function to handle incoming stream messages
function handleNewStreamMessage(data: RedisStreamMessage) {
  console.log("Processing message:", data);
  // Add your custom message processing logic here
}
export default redisClient;
