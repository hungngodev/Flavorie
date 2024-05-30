import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ServerError } from "../errors/customErrors.ts";
import { Ingredient } from '../models/IngredientModel.ts';
import { getAllMealsByIngredientsAPI, getMealByIdAPI, getRandomMealsAPI } from "../services/spoonacular/spoonacularServices.ts";
import { MainCategories } from "../services/themealdb/data.ts";
import {
  getMealByFilter,
  getMealById,
  getRandomMeal,
} from "../services/themealdb/themealdbServices.ts";
import { getRandomKey } from "../services/themealdb/utils.ts";


type theMealDB = {
  strMeal: string;
  idMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
}
export const getRandomMealsUnauthenticated = async (
  req: Request,
  res: Response,
) => {
  try {
    const { size, mainSize, sideSize, dessertSize, ingredients } = req.query;
    const queryRange = size ? parseInt(size.toString()) : 30;
    const mainRange = mainSize ? parseInt(mainSize.toString()) : 30;
    const sideRange = sideSize ? parseInt(sideSize.toString()) : 15;
    const dessertRange = dessertSize ? parseInt(dessertSize.toString()) : 15;

    const uniqueCheck = new Set<string>([]);
    function processingMeals(meal: theMealDB) {
      return {
        id: meal.idMeal,
        title: meal.strMeal,
        image: meal.strMealThumb,
        category: meal.strCategory + " " + meal.strArea,
        description: meal.strInstructions,
      }
    }
    const randomMeals = [];
    const suggestedMeals = [];
    for (let i = 0; i < queryRange; i++) {
      let randomMeal = await getRandomMeal();
      // check for duplicate meals
      while (randomMeal.strMeal && uniqueCheck.has(randomMeal.strMeal)) {
        randomMeal = await getRandomMeal();
      }
      uniqueCheck.add(randomMeal.strMeal);
      randomMeals.push(randomMeal);
    }
    const sideMeals = await getMealByFilter("category", "Side", sideRange);
    const mainMeals = await getMealByFilter(
      "category",
      getRandomKey(MainCategories),
      mainRange,
    );
    const dessertMeals = await getMealByFilter(
      "category",
      "Dessert",
      dessertRange,
    );
    if (ingredients && Array.isArray(ingredients)) {
      for (const ingredient of ingredients) {
        const mealList = await getMealByFilter("ingredient", ingredient.toString());
        suggestedMeals.push(mealList);
      }
    }
    const mealsReturn = {
      randomMeals: randomMeals.map(processingMeals),
      mainMeals: mainMeals.map(processingMeals),
      sideMeals: sideMeals.map(processingMeals),
      dessertMeals: dessertMeals.map(processingMeals),
      suggestedMeals: suggestedMeals.map(processingMeals),
    }
    return res.json(mealsReturn).status(StatusCodes.OK);
  } catch (error) {
    throw new ServerError(`${error}`);
  }
};

type spoonacularDB = {
  id: string;
  image: string;
  title: string;
  summary: string;
  occasions: [string];
  cuisines: [string];

}
export const getRanDomMealsAuthenticated = async (
  req: Request,
  res: Response,
) => {
  try {
    const { allergy, diet, leftOver } = req.body;

    const queryAllergy = allergy.reduce((acc: string, curr: string) => `${acc},${curr}`, "");
    const queryDiet = diet.reduce((acc: string, curr: string) => `${acc},${curr}`, "");
    function processingMeals(meal: spoonacularDB) {
      return {
        id: meal.id,
        title: meal.title,
        image: meal.image,
        category: meal.occasions.join(",") + " " + meal.cuisines.join(","),
        description: meal.summary,
      }
    }
    const randomMeals = await getRandomMealsAPI(
      queryDiet,
      queryAllergy, 30);
    const mainMeals = await getRandomMealsAPI(
      queryDiet + ",main course",
      queryAllergy, 30);
    const sideMeals = await getRandomMealsAPI(
      queryDiet + ",side dish",
      queryAllergy, 15);
    const dessertMeals = await getRandomMealsAPI(
      queryDiet + ",dessert",
      queryAllergy, 15);
    const suggestedMeals = await getAllMealsByIngredientsAPI(
      leftOver.map((item: Ingredient) => item.name).join(","),
      20,
    )

    const mealsReturn = {
      randomMeals: randomMeals.recipes.map(processingMeals),
      mainMeals: mainMeals.recipes.map(processingMeals),
      sideMeals: sideMeals.recipes.map(processingMeals),
      dessertMeals: dessertMeals.recipes.map(processingMeals),
      suggestedMeals: suggestedMeals.map(processingMeals),
    }
    //adding more meals of SPOONACULAR API
    return res.json(mealsReturn).status(StatusCodes.OK);
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
