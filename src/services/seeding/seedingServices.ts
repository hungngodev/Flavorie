import dotenv from "dotenv";
import mongoose from "mongoose";
import { NotFoundError, ServerError } from "../../errors/customErrors";
import Progress from "../../models/ProgressSeed";
import { IngredientBank } from "../../utils/queryBank";
import {
  findIngredientById,
  getAllIngredientsAPI,
} from "../spoonacular/spoonacularServices";

dotenv.config();

const keys = Object.keys(IngredientBank);

const rateWait = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

await mongoose.connect(process.env.MONGODB_URL || "", {});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
let progress = await Progress.findOne({ name: "spoonacular" });
if (!progress) {
  progress = new Progress({
    currentCagetory: 0,
    queryIndex: 0,
    childIndex: 0,
    parentIndex: 0,
    name: "spoonacular",
  });
  await progress.save();
  console.log("Progress created");
}

if (!progress) {
  throw new ServerError("Progress not found");
}
let { currentCagetory, queryIndex, childIndex, parentIndex } = progress;
async function saveProgress() {
  if (progress) {
    progress.currentCagetory = currentCagetory;
    progress.queryIndex = queryIndex;
    progress.childIndex = childIndex;
    progress.parentIndex = parentIndex;
    await progress.save();
  }
}

process.stdin.resume();
process.on("SIGINT", async function () {
  console.log("  ----> Stopping the seeding process...");
  await saveProgress();
  await mongoose.connection.close();
  process.exit();
});

const catchErrorSeedAPI = async (error: any): Promise<void> => {
  if (error instanceof ServerError) {
    if (error.message === "API limit reached") {
      console.log("API limit reached");
      await saveProgress();
      await mongoose.connection.close();
      process.exit();
    }
    if (error.message === "API rate limit reached") {
      console.log("Rate limit reached");
      await rateWait(60000);
    } else if (error instanceof NotFoundError) {
      console.log("Not found error");
    } else {
      console.dir(error);
      console.log("Error occured");
      await saveProgress();
      await mongoose.connection.close();
    }
  }
};
const tryCatchBlock = async (fn: any) => {
  try {
    await fn();
  } catch (error) {
    await catchErrorSeedAPI(error);
  }
};
const seedInformation = async () => {
  console.log("Seeding started");
  if (progress) {
    while (currentCagetory < keys.length) {
      console.log(`Current category: ${keys[currentCagetory]}`);
      const currentSearch =
        IngredientBank[keys[currentCagetory] as keyof typeof IngredientBank];
      while (queryIndex < currentSearch.length) {
        await tryCatchBlock(async () => {
          console.log(
            `Query ${queryIndex} of ${keys[currentCagetory]} -> ${currentSearch[queryIndex]}`,
          );
          const data = await getAllIngredientsAPI(
            "",
            currentSearch[queryIndex],
            100,
          );
          if (data) {
            while (parentIndex < data.results.length) {
              console.log(
                `Parent ${parentIndex} of query ${queryIndex} of ${keys[currentCagetory]}`,
              );
              await tryCatchBlock(async () => {
                const { id, children } = data.results[parentIndex];
                const parentIngredient = await findIngredientById(
                  keys[currentCagetory],
                  id,
                );
                while (childIndex < children.length) {
                  await tryCatchBlock(async () => {
                    const childIngredient = await findIngredientById(
                      keys[currentCagetory],
                      children[childIndex].id,
                    );
                    await childIngredient.save();
                    parentIngredient.relevance.push(childIngredient);
                  });
                  childIndex++;
                  console.log(
                    `-----------------Child ${childIndex} of parent ${parentIndex} of query ${queryIndex} completed of ${keys[currentCagetory]}`,
                  );
                }
                await parentIngredient.save();
              });
              console.log(
                `---------Parent ${parentIndex} of query ${queryIndex} completed of ${keys[currentCagetory]}`,
              );
              childIndex = 0;
              parentIndex++;
            }
            console.log(
              `Query ${queryIndex} of ${keys[currentCagetory]} completed`,
            );
          } else {
            console.log(
              `Query ${queryIndex} of ${keys[currentCagetory]} failed`,
            );
          }
        });
        parentIndex = 0;
        queryIndex++;
      }
      currentCagetory++;
      queryIndex = 0;
    }
    await saveProgress();
  }
};
await seedInformation();
await mongoose.connection.close();
console.log("Seeding completed");
process.exit();
