import { ServerError } from "@src/errors/customErrors";
import IngredientModel from "@src/models/IngredientModel";
import User from "@src/models/UserModel";
import {
  CategoryResults,
  classifyIngredient,
  findIngredients,
} from "@src/services/ingredientServices";
import { getAndStoreInRedis } from "@src/services/redisClient/index";
import {
  getAllIngredientsAPI,
  getIngredientsAutoCompleteAPI,
} from "@src/services/spoonacular/spoonacularServices";
import { getUserItems } from "@src/services/userServices";
import { IngredientBank } from "@src/utils/queryBank";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const getAllIngredients = async (req: Request, res: Response) => {
  const { category, sideBar } = req.query;
  // console.log("category querying", category);
  const categories = Object.keys(IngredientBank);
  try {
    console.log("Checking from Redis for ingredients");
    const redisKey = "ingredients " + category;
    const classifiedIngredients: CategoryResults = (await getAndStoreInRedis(
      redisKey,
      3600 * 24,
      async () => await classifyIngredient(category?.toString() || ""),
    )) as CategoryResults;
    if (sideBar) {
      return res.status(StatusCodes.OK).json({
        categories,
      });
    }
    return res.status(StatusCodes.OK).json({
      category: classifiedIngredients,
      categories,
    });
  } catch (e) {
    console.error("Error classifying ingredients:", e);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new ServerError("Failed to classify ingredients"));
  }

  // res.json({ ingredients, allergy, diet, leftOver }).status(StatusCodes.OK);
};

export const searchIngredients = async (req: Request, res: Response) => {
  console.log("recevived request");
  const ingredientName = req.query.search as string;
  const allergy: string[] = [];
  if ((req as any).user) {
    const thisUser = await User.findOne({ _id: (req as any).user.userId });
    if (thisUser) {
      allergy.push(...thisUser.allergy);
    }
  }
  const queryAllergy = allergy
    .reduce(
      (acc: string, curr: string) => `${curr.toString().toLowerCase()},${acc}`,
      "",
    )
    .slice(0, -1);

  if (!ingredientName || ingredientName === "" || ingredientName.length === 0) {
    const result = [];
    if ((req as any).user) {
      const myLeftOver = await getUserItems(
        (req as any).user.userId,
        "leftOver",
      );
      const likedMeals = JSON.parse(
        JSON.stringify(
          await getUserItems((req as any).user.userId, "likedMeal"),
        ),
      );
      for (const meal of likedMeals) {
        const missingIngredients = [];
        for (const mealIngredient of meal.likedMeal.allIngredients) {
          if (
            !myLeftOver.some(
              ingredient =>
                ingredient.itemId.toString() === mealIngredient.toString(),
            )
          ) {
            const missingIngredient =
              await IngredientModel.findById(mealIngredient);
            if (missingIngredient) {
              const repIngredient = {
                id: missingIngredient._id.toString(),
                name: missingIngredient.name,
                image: missingIngredient.image,
                category: missingIngredient.categoryPath,
                amount: missingIngredient.amount,
                unit: missingIngredient.unit,
                unitShort: missingIngredient.unitShort,
                nutrition: missingIngredient.nutrition,
              };
              missingIngredients.push(repIngredient);
            }
          }
        }
        result.push({
          meal: meal.likedMeal,
          missingIngredients: missingIngredients,
        });
      }
    }
    const randomIngredients = (await getAndStoreInRedis(
      "ingredient random",
      3600 * 24,
      async () =>
        await IngredientModel.aggregate([
          { $sample: { size: 40 } }, // Sample 40 random ingredients
          { $addFields: { id: "$_id" } }, // Add a new 'id' field with the value of '_id'
          { $unset: "_id" }, // Optional: remove the '_id' field if you don't want it
        ]),
    )) as [];

    // console.log("randomIngredients", randomIngredients);
    return res
      .json({
        result,
        numberOfIngredients: randomIngredients.length,
        ingredients: randomIngredients,
      })
      .status(StatusCodes.OK);
  } else {
    const ingredients = await findIngredients(
      ingredientName.toLowerCase().trim(),
      100,
    );
    const newResultsWithPopulate = [...ingredients];
    for (const ingredient of newResultsWithPopulate) {
      ingredients.push(...ingredient.relevance);
    }
    if (ingredients.length < 100) {
      const spoonacularIngredients = await getAllIngredientsAPI(
        queryAllergy,
        ingredientName.toLowerCase().trim(),
        20,
      );
      ingredients.push(...spoonacularIngredients.results);
      // console.log("spoonacularIngredients", spoonacularIngredients);
    }
    return res
      .json({ ingredients, numberOfIngredients: ingredients.length })
      .status(StatusCodes.OK);
  }
};

export const getIndividualIngredient = async (req: Request, res: Response) => {
  const { id: ingredientId } = req.params;
  const ingredient = await IngredientModel.findById(ingredientId);
  res.json({ ingredient }).status(StatusCodes.OK);
};
export const getSuggestionIngredients = async (req: Request, res: Response) => {
  try {
    console.log(req.query);
    const query = req.query.query as string;
    const formatedQuery = query.toLowerCase().trim();
    const ingredientSuggestions = await findIngredients(formatedQuery, 10);
    const filterSuggestions =
      ingredientSuggestions && ingredientSuggestions.length > 0
        ? ingredientSuggestions.map(ingredient => ({
            title: ingredient.name,
          }))
        : [];
    if (filterSuggestions.length < 10) {
      const spoonacularSuggestions = await getIngredientsAutoCompleteAPI(
        formatedQuery,
        10 - filterSuggestions.length,
      );
      filterSuggestions.unshift(...spoonacularSuggestions);
    }
    res.json(filterSuggestions).status(StatusCodes.OK);
  } catch (error) {
    console.log("Error when searching ingredients", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new ServerError("Failed to search ingredients"));
  }
};

export const getReceiptsSuggestionIngredients = async (
  req: Request,
  res: Response,
) => {
  try {
    const query = req.query.name as string;
    const formatedQuery = query.toLowerCase().trim();
    const ingredientSuggestions = await findIngredients(formatedQuery, 100);
    const filterSuggestions = ingredientSuggestions.map(ingredient => ({
      name: ingredient.name,
      img: ingredient.image,
      id: ingredient._id,
    }));
    res.json({ filterSuggestions }).status(StatusCodes.OK);
  } catch (error) {
    console.log("Error when searching ingredients", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new ServerError("Failed to search ingredients"));
  }
};
