import NotificationModel from "@src/models/NotificationModel";
import dotenv from "dotenv";
import { Redis } from "ioredis";
import mongoose, { Types } from "mongoose";
import { resolve } from "path";
import { groceryGenerating } from "./connecting";

dotenv.config({ path: resolve(__dirname, "../../../.env") });

console.log(process.env.REDIS_URL);
const redisClient = new Redis(process.env.REDIS_URL || "");

try {
  mongoose.connect(process.env.MONGODB_URL ?? "");
  console.log("Connected to MongoDB");
} catch (error) {
  console.log(error);
  process.exit(1);
}

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", err => {
  console.error("Redis connection error:", err);
});

interface RequestInstacart {
  listOfNames: string;
  userId: string;
  timestamp: string;
  type: string;
}

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
          1,
          "BLOCK",
          0,
          "STREAMS",
          streamName,
          ">",
        );

        if (messages) {
          const [stream, entries] = messages[0] as [
            string,
            [string, string[]][],
          ];
          const request: RequestInstacart = arrayToObject(entries[0][1]);
          const listOfNames = JSON.parse(request.listOfNames);
          console.log("Received message:", listOfNames);
          try {
            const response = await groceryGenerating(listOfNames);
            const notification = new NotificationModel({
              userId: new Types.ObjectId(request.userId),
              status: false,
              message: {
                title: "Connecting With Instacart Successfully!",
                data: response,
                notificationType: "instacart",
              },
              timestamp: new Date(request.timestamp),
            });
            await notification.save();
          } catch (error) {
            console.log("Error connecting to Instacart", error);

            const notification = new NotificationModel({
              userId: new Types.ObjectId(request.userId),
              status: false,
              message: {
                title:
                  "Cannot connect to Instacart because the system is overloading. Please try again!",
              },
              timestamp: new Date(request.timestamp),
            });
            await notification.save();
          }
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
listenToRedisStream(
  "server:instacart_stream",
  "instacart_group",
  "instacart_consumer",
); // Start listening to the stream

function arrayToObject(keyValueArray): RequestInstacart {
  const extractedObject = {};

  for (let i = 0; i < keyValueArray.length; i += 2) {
    const key = keyValueArray[i];
    const value = keyValueArray[i + 1];
    extractedObject[key] = value;
  }

  return extractedObject as RequestInstacart;
}

// Function to handle incoming stream messages
// async function handleNewStreamMessage(data: RedisStreamMessage) {
//   console.log("Processing message:", data);
//   try {
//     const response = await groceryGenerating(listOfNames);
//     const notification = new NotificationModel({
//       userId: socket.data.user.userId,
//       status: false,
//       message: {
//         title: "Connecting With Instacart Successfully!",
//         data: response,
//         notificationType: "instacart",
//       },
//       timestamp: new Date(),
//     });
//     await notification.save();
//   } catch (error) {
//     console.log("Error connecting to Instacart", error);
//     socket.emit("error", "Failed to connect to Instacart");
//     const notification = new NotificationModel({
//       userId: socket.data.user.userId,
//       status: false,
//       message: {
//         title:
//           "Cannot connect to Instacart because the system is overloading. Please try again!",
//       },
//       timestamp: new Date(),
//     });
//     await notification.save();
//   }

//   // Add your custom message processing logic here
// }
