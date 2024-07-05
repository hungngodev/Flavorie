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
import { getAllIngredientsAPI } from "../services/spoonacular/spoonacularServices.ts";
import { getUserItems } from "../services/userServices.ts";

export const getAllIngredients = async (req: Request, res: Response) => {
  const { category, sideBar } = req.query;
  const allergy = [];
  const diet = [];
  const leftOver = [];
  if (req.user) {
    const thisUser = await User.findOne({ _id: req.user.userId });
    if (thisUser) {
      allergy.push(...thisUser.allergy);
      diet.push(thisUser.diet);
      const myLeftOver = await getUserItems(req.user.userId, "leftOver");
      leftOver.push(...myLeftOver);
    }
    allergy.map(allergy => allergy.toString().toLowerCase());
    diet.map(diet => diet.toString().toLowerCase());
  }

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
      allergy,
      diet,
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
  const ingredientName = req.query.ingredientName as string;
  let { allergy, diet } = req.body;
  if (!allergy || !diet) allergy = diet = [];
  const ingredients = await getAllIngredientsAPI(
    allergy,
    diet,
    ingredientName,
    50,
  );
  res.json({ ingredients }).status(StatusCodes.OK);
};

export const getIndividualIngredient = async (req: Request, res: Response) => {
  const { id: ingredientId } = req.params;
  const ingredient = await IngredientModel.findById(ingredientId);
  res.json({ ingredient }).status(StatusCodes.OK);
};
export const getSuggestionIngredients = async (req: Request, res: Response) => {
  try {
    const query = req.query.name as string;
    const formatedQuery = query.toLowerCase().trim();
    const ingredientSuggestions = await findIngredients(formatedQuery);
    const filterSuggestions = ingredientSuggestions.map(ingredient => ({
      name: ingredient.name,
      img: ingredient.image,
    }));
    res.json({ filterSuggestions }).status(StatusCodes.OK);
  } catch (error) {
    console.log("Error when searching ingredients", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new ServerError("Failed to search ingredients"));
  }
};
