import Ingredients, { Ingredient } from "../models/IngredientModel.ts";
import { IngredientBank } from "../utils/queryBank.ts";

export async function getIngredientWithName(ingredientName: string) {
  return await Ingredients.find({
    originalName: { $regex: ingredientName, $options: "i" },
  });
}

export async function getIngredientsWithCategory(category: string) {
  return await Ingredients.find({
    categoryPath: { $in: [category] },
  }).populate<{
    relevance: Ingredient;
  }>("relevance");
}

type QueryResults = {
  queryKey: string;
  ingredients: {
    id: string;
    name: string;
    image: string;
    category: string[];
  }[];
};
type CategoryResults = {
  categoryName: string;
  numberOfQueryKeys: number;
  totalNumberOfIngredients: number;
  results: QueryResults[];
};
export async function classifyIngredient() {
  const outputs: CategoryResults[] = [];
  for (const category in IngredientBank) {
    const queryKeys = IngredientBank[category as keyof typeof IngredientBank];
    const categoryResults: CategoryResults = {
      categoryName: category,
      numberOfQueryKeys: queryKeys.length,
      totalNumberOfIngredients: 0,
      results: [],
    };

    for (const key of queryKeys) {
      const ingredients = await Ingredients.aggregate([
        {
          $match: {
            originalName: { $regex: key, $options: "i" },
            relevance: { $exists: true },
          },
        },
        {
          $addFields: { relevance_count: { $size: "$relevance" } },
        },
        {
          $sort: { relevance_count: -1 },
        },
      ]);

      categoryResults.totalNumberOfIngredients += ingredients.length;
      if (ingredients.length === 0) continue;
      categoryResults.results.push({
        queryKey: key,
        ingredients: ingredients.map((ingredient: Ingredient) => ({
          id: ingredient._id.toString(),
          name: ingredient.name,
          image: ingredient.image,
          category: ingredient.categoryPath,
          amount: ingredient.amount,
          unit: ingredient.unit,
          unitShort: ingredient.unitShort,
          nutrition: ingredient.nutrition,
        })),
      });
    }
    outputs.push(categoryResults);
  }
  return outputs;
}

export async function classifyIngredientByAisle() {
  const aisles = await Ingredients.aggregate([
    {
      $project: {
        name: 1,
        allAisles: { $split: ["$aisle", ";"] },
        id: 1,
        myCagetory: 1,
        original: 1,
        originalName: 1,
        amount: 1,
        unit: 1,
        unitShort: 1,
        unitLong: 1,
        possibleUnits: 1,
        estimatedCost: 1,
        consistency: 1,
        shoppingListUnits: 1,
        aisle: 1,
        image: 1,
        meta: 1,
        nutrition: 1,
        allergy: 1,
        diet: 1,
        categoryPath: 1,
        relevance: 1,
      },
    },
    { $unwind: "$allAisles" },
    {
      $group: {
        _id: "$allAisles",
        ingredients: {
          $push: {
            _id: "$_id",
            id: "$id",
            myCagetory: "$myCagetory",
            original: "$original",
            originalName: "$originalName",
            name: "$name",
            amount: "$amount",
            unit: "$unit",
            unitShort: "$unitShort",
            unitLong: "$unitLong",
            possibleUnits: "$possibleUnits",
            estimatedCost: "$estimatedCost",
            consistency: "$consistency",
            shoppingListUnits: "$shoppingListUnits",
            aisle: "$aisle",
            image: "$image",
            meta: "$meta",
            nutrition: "$nutrition",
            allergy: "$allergy",
            diet: "$diet",
            categoryPath: "$categoryPath",
            relevance: "$relevance",
          },
        },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  aisles[
    aisles.findIndex(aisle => aisle._id == "Bakery/Bread")
  ].ingredients.push(
    ...aisles[
      aisles.findIndex(aisle => aisle._id == "Baking")
    ].ingredients.concat(
      aisles[aisles.findIndex(aisle => aisle._id == "Bread")].ingredients,
    ),
  );
  const results = [];
  for (const aisle of aisles.filter(
    aisle =>
      ![
        "Bread",
        "Baking",
        "Ethnic",
        "Online",
        "Grilling Supplies",
        "Not in Grocery Store/Homemade",
      ].some(e => e === aisle._id),
  )) {
    const queryResults = [];
    let i = 1;
    let ingredientQuery = [];
    for (const ingredient of aisle.ingredients) {
      if (ingredientQuery.length <= 8) {
        ingredientQuery.push({
          id: ingredient._id,
          name: ingredient.name,
          image: ingredient.image,
          category: ingredient.categoryPath,
          amount: ingredient.amount,
          unit: ingredient.unit,
          unitShort: ingredient.unitShort,
          nutrition: ingredient.nutrition,
        });
      } else {
        queryResults.push({
          queryKey: `Row ${i++}`,
          ingredients: ingredientQuery,
        });
        ingredientQuery = [];
      }
    }

    results.push({
      categoryName: aisle._id.includes("Alcohol")
        ? "Alcohol"
        : aisle._id.includes("Canned")
          ? "Canned"
          : aisle._id.includes("Bakery")
            ? "Bakery"
            : aisle._id.includes("Produce")
              ? "Fruit"
              : aisle._id.includes("Ethnic")
                ? "Ethnic"
                : aisle._id,
      numberOfQueryKeys: aisle.ingredients.length / 2,
      totalNumberOfIngredients: aisle.ingredients.length,
      results: queryResults,
    });
  }
  return results;
}

export async function findIngredients(query: string, limit: number) {
  return await Ingredients.find({
    $or: [
      { originalName: { $regex: query.toLowerCase().trim(), $options: "i" } },
      { original: { $regex: query.toLowerCase().trim(), $options: "i" } },
      { name: { $regex: query.toLowerCase().trim(), $options: "i" } },
    ],
  })
    .populate("relevance")
    .limit(limit);
}
