import { input } from "@inquirer/prompts";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { NotFoundError, ServerError } from "../../errors/customErrors";
import IngredientModel from "../../models/IngredientModel";
import MatchingModel from "../../models/MatchingModel";
import {
  getAllIngredientsAPI,
  getIngredientByIdAPI,
} from "../spoonacular/spoonacularServices";
import themealData from "./themeal-ingredient";

dotenv.config();
const listOfIngredients = themealData;

await mongoose.connect(process.env.MONGODB_URL || "", {});

const db = mongoose.connection;

const rateWait = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
let currentMatching = await MatchingModel.findOne({ name: "themealdb" });
if (!currentMatching) {
  currentMatching = new MatchingModel({
    progress: 0,
    name: "themealdb",
    mapIngredients: {},
  });
  await currentMatching.save();
  console.log("Matching created");
}

process.stdin.resume();
process.on("SIGINT", async function () {
  console.log("  ----> Stopping the matching process...");
  await currentMatching.save();
  await mongoose.connection.close();
  process.exit();
});

const catchErrorSeedAPI = async (error: any): Promise<void> => {
  console.log("Handling error");
  if (error instanceof ServerError) {
    if (error.message === "API limit reached") {
      console.log("API limit reached");
      await currentMatching.save();
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
      await currentMatching.save();
      await mongoose.connection.close();
    }
  }
};
const category = {
  meat: (categoryPath: string[]) =>
    categoryPath.some(category => category.toLowerCase().includes("meat")),
  vegetable: (categoryPath: string[]) =>
    categoryPath.some(category => category.toLowerCase().includes("vegetable")),
  sauce: (categoryPath: string[]) =>
    categoryPath.some(category => category.toLowerCase().includes("sauce")),
  fruit: (categoryPath: string[]) =>
    categoryPath.some(category => category.toLowerCase().includes("fruit")),
  seafood: (categoryPath: string[]) =>
    categoryPath.some(category => category.toLowerCase().includes("seafood")),
  nut: (categoryPath: string[]) =>
    categoryPath.some(category => category.toLowerCase().includes("nuts")),
  spice: (categoryPath: string[]) =>
    categoryPath.some(category => category.toLowerCase().includes("spices")),
  grain: (categoryPath: string[]) =>
    categoryPath.some(category => category.toLowerCase().includes("grains")),
};

async function matching() {
  console.log(listOfIngredients.length);
  if (!currentMatching) {
    throw new ServerError("Matching not found");
  }
  for (let z = currentMatching.progress; z < listOfIngredients.length; z++) {
    const ingredient = listOfIngredients[z];
    console.log(z + "." + "  Ingredient To Match: " + ingredient.strIngredient);
    try {
      let { results } = await getAllIngredientsAPI(
        "",
        ingredient.strIngredient.toLowerCase(),
        2,
      );
      while (results.length === 0) {
        console.log("No results found, please try again");
        const newQuery = await input({
          message: "Please enter a new query",
        });
        results = (await getAllIngredientsAPI("", newQuery, 2)).results;
      }
      console.log("Results found");
      const { id: idFirstMatch } = results[0];
      console.log("First match id: " + idFirstMatch);
      const Ingredient = await IngredientModel.findOne({ id: idFirstMatch });
      if (!Ingredient) {
        console.log("Have to call the API");
        const newIngredient = await getIngredientByIdAPI(idFirstMatch);
        const categoryPath = newIngredient.categoryPath;
        let categoryMatched = "";
        for (const entries of Object.entries(category)) {
          if (entries[1](categoryPath)) {
            categoryMatched = entries[0];
            console.log("Category found: " + categoryMatched);
            break;
          }
        }
        if (categoryMatched === "") {
          console.log("Category not found");
          const newCategory = await input({
            message: "Please enter a category",
          });
          categoryMatched = newCategory;
        }
        const newIngredientModel = new IngredientModel(newIngredient);
        newIngredientModel.myCagetory = categoryMatched;
        await newIngredientModel.save();
        currentMatching.mapIngredients.set(
          ingredient.strIngredient.toLowerCase().trim(),
          newIngredientModel._id,
        );
      } else {
        console.log("Found in the database");
        currentMatching.mapIngredients.set(
          ingredient.strIngredient.toLowerCase().trim(),
          Ingredient._id,
        );
      }
      await currentMatching.save();
    } catch (error) {
      console.log("Error occured");
      console.dir(error);
      await catchErrorSeedAPI(error);
    }
    currentMatching.progress += 1;
    await currentMatching.save();
  }
}
await matching();
await mongoose.connection.close();
console.log("Matching completed");
process.exit();
