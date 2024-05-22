import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ServerError } from "../errors/customErrors.ts";
import { Ingredient } from '../models/IngredientModel.ts';
import { getAllMealsByIngredientsAPI, getMealByIdAPI, getRandomMealsAPI } from "../services/spoonacular/spoonacularServices.ts";
import { MainCategories } from "../services/themealdb/data.ts";
import {
  getMealByFilter,
  getRandomMeal,
  getMealById,
} from "../services/themealdb/themealdbServices.ts";
import { getRandomKey } from "../services/themealdb/utils.ts";

export const getRandomMealsUnauthenticated = async (
  req: Request,
  res: Response,
) => {
  try {
    const { size, mainSize, sideSize, dessertSize, ingredients } = req.query;
    const queryRange = size ? parseInt(size.toString()) : 30;
    const mainRange = mainSize ? parseInt(mainSize.toString()) : 10;
    const sideRange = sideSize ? parseInt(sideSize.toString()) : 5;
    const dessertRange = dessertSize ? parseInt(dessertSize.toString()) : 5;

    const response: {
      randomMeals: {}[], mainMeals: {}[];
      sideMeals: {}[];
      dessertMeals: {}[];
      suggestedMeals: {}[];
    } = {
      randomMeals: [],
      mainMeals: [],
      sideMeals: [],
      dessertMeals: [],
      suggestedMeals: [],
    };
    const uniqueCheck = new Set<string>([]);

    for (let i = 0; i < queryRange; i++) {
      let randomMeal = await getRandomMeal();
      // check for duplicate meals
      while (randomMeal.strMeal && uniqueCheck.has(randomMeal.strMeal)) {
        randomMeal = await getRandomMeal();
      }
      uniqueCheck.add(randomMeal.strMeal);
      response.randomMeals.push(randomMeal);
    }
    response.sideMeals = await getMealByFilter("category", "Side", sideRange);
    response.mainMeals = await getMealByFilter(
      "category",
      getRandomKey(MainCategories),
      mainRange,
    );
    response.dessertMeals = await getMealByFilter(
      "category",
      "Dessert",
      dessertRange,
    );
    if (ingredients && Array.isArray(ingredients)) {
      for (const ingredient of ingredients) {
        const mealList = await getMealByFilter("ingredient", ingredient.toString());
        response.suggestedMeals.push(mealList);
      }
    }
    return res.json(response).status(StatusCodes.OK);
  } catch (error) {
    throw new ServerError(`${error}`);
  }
};

export const getRanDomMealsAuthenticated = async (
  req: Request,
  res: Response,
) => {
  try {
    const { allergy, diet, leftOver } = req.body;
    const queryAllergy = allergy.reduce((acc: string, curr: string) => `${acc},${curr}`, "");
    const queryDiet = diet.reduce((acc: string, curr: string) => `${acc},${curr}`, "");
    const response: {
      randomMeals: {}[], mainMeals: {}[];
      sideMeals: {}[];
      dessertMeals: {}[];
      suggestedMeals: {}[];
    } = {
      randomMeals: [],
      mainMeals: [],
      sideMeals: [],
      dessertMeals: [],
      suggestedMeals: [],
    };
    response.mainMeals = await getRandomMealsAPI(
      queryDiet + ",main course",
      queryAllergy, 30);
    response.sideMeals = await getRandomMealsAPI(
      queryDiet + ",side dish",
      queryAllergy, 15);
    response.dessertMeals = await getRandomMealsAPI(
      queryDiet + ",dessert",
      queryAllergy, 15);
    response.suggestedMeals = await getAllMealsByIngredientsAPI(
      leftOver.map((item: Ingredient) => item.name).join(","),
      20,
    )
    //adding more meals of SPOONACULAR API
    return res.json(response).status(StatusCodes.OK);
  } catch (error) {
    throw new ServerError(`${error}`);
  }
};

export const getAllMeals = async (req: Request, res: Response) => {
  if (req.user) {
    return getRanDomMealsAuthenticated(req, res);
  }
  return getRandomMealsUnauthenticated(req, res);
}


export const getIndividualMealUnauthenticated = async (req: Request, res: Response) => {
  // get individual meal by id from themealdb
  const { mealId } = req.params;
  try {
    const meal = getMealById(mealId);
    return res.json(meal).status(StatusCodes.OK);
  } catch (error) {
    throw new ServerError(`${error}`);
  }
}

export const getIndividualMealAuthenticated = async (req: Request, res: Response) => {
  // get individual meal by id from spoonacular
  const { mealId } = req.params;
  try {
    const meal = await getMealByIdAPI(mealId);
    return res.json(meal).status(StatusCodes.OK);
  } catch (error) {
    throw new ServerError(`${error}`);
  }

}

export const getIndividualMeal = async (req: Request, res: Response) => {
  if (req.user) {
    return getIndividualMealAuthenticated(req, res);
  }
  return getIndividualMealUnauthenticated(req, res);
}
