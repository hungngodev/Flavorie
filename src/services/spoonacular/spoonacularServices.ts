import axios, { AxiosError } from "axios";
import qs from "qs";
import { NotFoundError, ServerError } from "../../errors/customErrors.ts";
import ApiTrack from "../../models/ApiTrack.ts";
import Ingredients from "../../models/IngredientModel.ts";

import dotenv from "dotenv";
dotenv.config();

export const EndPoint = {
  FIND_RECIPES_BY_INGREDIENTS: "/recipes/findByIngredients",
  FIND_INGREDIENTS: "/food/ingredients/search",
  FIND_INGREDIENTS_BY_ID: (id: string) => `/food/ingredients/${id}/information`,
  RANDOM_RECIPES: "/recipes/random",
  FIND_RECIPES_ID: (id: string) => `/recipes/${id}/information`,
  ANALYZE_INSTRUCTIONS: "/recipes/analyzeInstructions",
  COMPLEX_SEARCH: "/recipes/complexSearch",
  AUTO_COMPLETE: "/recipes/autocomplete",
  AUTO_COMPLETE_INGREDIENTS: "/food/ingredients/autocomplete",
};

const baseURL = axios.create({
  baseURL: process.env.SPOONACULAR_API_ENDPOINT || "",
});

const arrKey = [
  process.env.SPOONACULAR_API_KEY,
  process.env.SPOONACULAR_API_KEY_2,
  process.env.SPOONACULAR_API_KEY_3,
  process.env.SPOONACULAR_API_KEY_4,
  process.env.SPOONACULAR_API_KEY_5,
  process.env.SPOONACULAR_API_KEY_6,
  process.env.SPOONACULAR_API_KEY_7,
  process.env.SPOONACULAR_API_KEY_8,
  process.env.SPOONACULAR_API_KEY_9,
  process.env.SPOONACULAR_API_KEY_10,
  process.env.SPOONACULAR_API_KEY_11,
  process.env.SPOONACULAR_API_KEY_12,
];

export const baseCall = async (
  url: string,
  query: Record<string, any>,
  method = "get",
  data?: Record<string, any>,
) => {
  let SpoonacularTrack = await ApiTrack.findOne({ serviceName: "Spoonacular" });
  if (!SpoonacularTrack) {
    SpoonacularTrack = new ApiTrack({
      serviceName: "Spoonacular",
      usageCount: 0,
      currentKey: 0,
      callPerMin: 0,
      updatedAt: new Date(),
      lastMinute: new Date(),
    });
  }
  let { usageCount, currentKey, callPerMin, lastMinute } = SpoonacularTrack;

  const maxCall =
    (process.env.SPOONACULAR_MAX_CALL
      ? parseInt(process.env.SPOONACULAR_MAX_CALL)
      : 130) - 1;
  const numberOfKey = process.env.SPOONACULAR_TOTAL_KEY
    ? parseInt(process.env.SPOONACULAR_TOTAL_KEY)
    : 5;
  const rate =
    (process.env.SPOONACULAR_RATE
      ? parseInt(process.env.SPOONACULAR_RATE)
      : 50) - 1;

  if (SpoonacularTrack.updatedAt.getDay() != new Date().getDay()) {
    usageCount = 0;
    currentKey = 0;
  }
  if (Math.abs(Number(new Date().getTime()) - Number(lastMinute)) > 60000) {
    callPerMin = 0;
    lastMinute = new Date();
  }
  if (usageCount > maxCall && currentKey < numberOfKey) {
    currentKey++;
    usageCount = 0;
  }
  if (usageCount > maxCall && currentKey >= numberOfKey - 1) {
    throw new ServerError("API limit reached");
  }
  if (
    callPerMin > rate &&
    Math.abs(Number(new Date().getTime()) - Number(lastMinute)) < 60000
  ) {
    await new Promise(resolve => setTimeout(resolve, 60000));
  }

  SpoonacularTrack.usageCount = usageCount + 1;
  SpoonacularTrack.currentKey = currentKey;
  SpoonacularTrack.callPerMin = callPerMin + 1;
  SpoonacularTrack.lastMinute = lastMinute;
  await SpoonacularTrack.save();
  while (true) {
    try {
      const params = new URLSearchParams({
        apiKey: `${arrKey[currentKey]}`,
        number: "100",
        ...query,
      });
      if (method === "get") {
        const response = await baseURL.get(url, { params });
        return response.data;
      }
      if (method === "post") {
        const response = await baseURL.post(url, qs.stringify(data), {
          params,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        return response.data;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        // throw new NotFoundError(`Error: ${error.response?.data}`);
        console.log("Change key");
        console.dir(error);
        SpoonacularTrack.currentKey = currentKey + 1;
        SpoonacularTrack.usageCount = 0;
        SpoonacularTrack.callPerMin = 0;
        SpoonacularTrack.lastMinute = new Date();
        await SpoonacularTrack.save();
      } else {
        throw new ServerError(`Error: ${error}`);
      }
    }
  }
};

export const getAllIngredientsAPI = async (
  allergy: string,
  query: string,
  number: number,
) => {
  return await baseCall(EndPoint.FIND_INGREDIENTS, {
    query: query,
    number: number.toString(),
    addChildren: "true",
    intolerances: allergy,
  });
};

export const getIngredientByIdAPI = async (id: string) => {
  return await baseCall(EndPoint.FIND_INGREDIENTS_BY_ID(id), {
    amount: "100",
    unit: "grams",
  });
};

export const findIngredientById = async (cagetory: string, id: Number) => {
  const find = await Ingredients.findOne({ id: id });
  if (find) {
    return find;
  } else {
    const info = await getIngredientByIdAPI(`${id}`);
    const newIngredient = new Ingredients({
      id: id,
      ...info,
      myCagetory: cagetory,
    });
    await newIngredient.save();
    return newIngredient;
  }
};

export const getAllMealsComplexSearch = async (
  query: string,
  diet: string,
  intolerances: string,
  sort: string,
  number: number,
) => {
  return await baseCall(EndPoint.COMPLEX_SEARCH, {
    query: query,
    diet: diet,
    intolerances: intolerances,
    sort: sort,
    number: number.toString(),
    addRecipeInformation: "true",
    addRecipeInstructions: "true",
    instructionsRequired: "true",
  });
};

export const getMealsAutoCompleteAPI = async (
  query: string,
  number: number,
) => {
  return await baseCall(EndPoint.AUTO_COMPLETE, {
    query: query,
    number: number.toString(),
  });
};

export const getIngredientsAutoCompleteAPI = async (
  query: string,
  number: number,
) => {
  return await baseCall(EndPoint.AUTO_COMPLETE_INGREDIENTS, {
    query: query,
    number: number.toString(),
  });
};

export const getAllMealsByIngredientsAPI = async (
  ingredients: string,
  number: number,
) => {
  //add more fields like allergy, diet, etc
  return await baseCall(EndPoint.FIND_RECIPES_BY_INGREDIENTS, {
    ingredients: ingredients,
    number: number.toString(),
    ranking: "1",
    ignorePantry: "true",
  });
};

export const getRandomMealsAPI = async (
  includeTags?: string,
  excludeTags?: string,
  number?: number,
) => {
  return await baseCall(EndPoint.RANDOM_RECIPES, {
    number: number?.toString(),
    "include-tags": includeTags,
    "exclude-tags": excludeTags,
  });
};

export const getMealByIdAPI = async (id: string) => {
  return await baseCall(EndPoint.FIND_RECIPES_ID(id), {
    addTasteData: "true",
    includeNutrition: "true",
  });
};

export const analyzeInstruction = async (instructions: string) => {
  return await baseCall(EndPoint.ANALYZE_INSTRUCTIONS, {}, "post", {
    instructions: instructions,
  });
};

// const intolerances: string[] = [
//   "Dairy",
//   "Egg",
//   "Gluten",
//   "Grain",
//   "Peanut",
//   "Seafood",
//   "Sesame",
//   "Shellfish",
//   "Soy",
//   "Sulfite",
//   "Tree Nut",
//   "Wheat",
// ];

// const cuisines: string[] = [
//   "African",
//   "Asian",
//   "American",
//   "British",
//   "Cajun",
//   "Caribbean",
//   "Chinese",
//   "Eastern European",
//   "European",
//   "French",
//   "German",
//   "Greek",
//   "Indian",
//   "Irish",
//   "Italian",
//   "Japanese",
//   "Jewish",
//   "Korean",
//   "Latin American",
//   "Mediterranean",
//   "Mexican",
//   "Middle Eastern",
//   "Nordic",
//   "Southern",
//   "Spanish",
//   "Thai",
//   "Vietnamese",
// ];

// const mealTypes: string[] = [
//   "main course",
//   "side dish",
//   "dessert",
//   "appetizer",
//   "salad",
//   "bread",
//   "breakfast",
//   "soup",
//   "beverage",
//   "sauce",
//   "marinade",
//   "fingerfood",
//   "snack",
//   "drink",
// ];

// const recipeSortingOptions: string[] = [
//   "",
//   "meta-score",
//   "popularity",
//   "healthiness",
//   "price",
//   "time",
//   "random",
//   "max-used-ingredients",
//   "min-missing-ingredients",
//   "alcohol",
//   "caffeine",
//   "copper",
//   "energy",
//   "calories",
//   "calcium",
//   "carbohydrates",
//   "carbs",
//   "choline",
//   "cholesterol",
//   "total-fat",
//   "fluoride",
//   "trans-fat",
//   "saturated-fat",
//   "mono-unsaturated-fat",
//   "poly-unsaturated-fat",
//   "fiber",
//   "folate",
//   "folic-acid",
//   "iodine",
//   "iron",
//   "magnesium",
//   "manganese",
//   "vitamin-b3",
//   "niacin",
//   "vitamin-b5",
//   "pantothenic-acid",
//   "phosphorus",
//   "potassium",
//   "protein",
//   "vitamin-b2",
//   "riboflavin",
//   "selenium",
//   "sodium",
//   "vitamin-b1",
//   "thiamin",
//   "vitamin-a",
//   "vitamin-b6",
//   "vitamin-b12",
//   "vitamin-c",
//   "vitamin-d",
//   "vitamin-e",
//   "vitamin-k",
//   "sugar",
//   "zinc",
// ];
