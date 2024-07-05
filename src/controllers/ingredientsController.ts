import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ServerError } from "../errors/customErrors.ts";
import IngredientModel from "../models/IngredientModel.ts";
import User from "../models/UserModel.ts";
import {
  classifyIngredient,
  classifyIngredientByAisle,
  findIngredients,
} from "../services/ingredientServices.ts";
import {
  getAllIngredientsAPI,
  getIngredientsAutoCompleteAPI,
} from "../services/spoonacular/spoonacularServices.ts";
import { getUserItems } from "../services/userServices.ts";

export const getAllIngredients = async (req: Request, res: Response) => {
  const { category, sideBar } = req.query;

  if (category === "/") {
    return res.status(StatusCodes.OK).json({
      category: [],
      categories: [],
    });
  }
  console.log("category querying", category);
  try {
    const classifiedIngredients = await classifyIngredient();
    if (sideBar)
      return res.status(StatusCodes.OK).json({
        categories: classifiedIngredients.map(
          SubCategory => SubCategory.categoryName,
        ),
      });
    console.log(
      classifiedIngredients.map(SubCategory => SubCategory.categoryName),
    );
    return res.status(StatusCodes.OK).json({
      category: classifiedIngredients.filter(
        SubCategory => SubCategory.categoryName === category,
      ),
      categories: classifiedIngredients.map(
        SubCategory => SubCategory.categoryName,
      ),
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
  if (req.user) {
    const thisUser = await User.findOne({ _id: req.user.userId });
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

  if (!ingredientName || ingredientName === "") {
    const result = [];
    const myLeftOver = await getUserItems(req.user.userId, "leftOver");
    const likedMeals = JSON.parse(
      JSON.stringify(await getUserItems(req.user.userId, "likedMeal")),
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
    const randomIngredients = await IngredientModel.aggregate([
      { $sample: { size: 40 } },
    ]);
    console.log("randomIngredients", randomIngredients);
    return res
      .json({
        result,
        numberOfIngredients: randomIngredients.length + 7,
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
      console.log("relevance", ingredient.relevance);
      ingredients.push(...ingredient.relevance);
    }
    if (ingredients.length < 100) {
      const spoonacularIngredients = await getAllIngredientsAPI(
        queryAllergy,
        ingredientName.toLowerCase().trim(),
        10,
      );
      console.log("spoonacularIngredients", spoonacularIngredients);
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
