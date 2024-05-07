import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, ServerError } from "../errors/customErrors.ts";
import { getAllMealsAPI } from "../services/spoonacular/spoonacularServices.ts";
import { MainCategories } from "../services/themealdb/data.ts";
import {
  getMealByFilter,
  getRandomMeal,
} from "../services/themealdb/themealdbServices.ts";
import { getRandomKey } from "../services/themealdb/utils.ts";

export const getAllMeals = async (req: Request, res: Response) => {
  const { ingredients } = req.query;
  if (!ingredients || typeof ingredients !== "string") {
    throw new BadRequestError("Please provide a list of ingredients");
  } else {
    try {
      const recipes = await getAllMealsAPI(ingredients.split(","));
      return res.json(recipes).status(StatusCodes.OK);
    } catch (error) {
      // return res.status(500).json({ message: `${error}` })
      throw new ServerError(`${error}`);
    }
  }
};

export const getRandomMealsUnauthenticated = async (
  req: Request,
  res: Response,
) => {
  try {
    const { size } = req.body;
    const queryRange = size ? parseInt(size.toString()) : 30;

    const response: { randomMeals: {}[] } = {
      randomMeals: [],
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
    const { mainSize, sideSize, dessertSize } = req.body;
    const mainRange = mainSize ? parseInt(mainSize.toString()) : 10;
    const sideRange = sideSize ? parseInt(sideSize.toString()) : 5;
    const dessertRange = dessertSize ? parseInt(dessertSize.toString()) : 5;

    const response: {
      mainMeals: {}[];
      sideMeals: {}[];
      dessertMeals: {}[];
    } = { mainMeals: [], sideMeals: [], dessertMeals: [] };

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

    return res.json(response).status(StatusCodes.OK);
  } catch (error) {
    throw new ServerError(`${error}`);
  }
};

export const getMealsFromLeftOver = async (req: Request, res: Response) => {
  try {
    let { ingredients } = req.body;

    const response: { suggestedMeals: any } = {
      suggestedMeals: [],
    };

    for (const ingredient of ingredients) {
      const mealList = await getMealByFilter("ingredient", ingredient);
      response.suggestedMeals.push(mealList);
    }

    res.json(response).status(StatusCodes.OK);
  } catch (error) {
    throw new ServerError(`${error}`);
  }
};
