import { analyzeInstruction } from '../services/spoonacular/spoonacularServices.ts'
import { createMeal } from '../services/mealServices.ts';
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
  getMealByName
} from "../services/themealdb/themealdbServices.ts";
import { getRandomKey } from "../services/themealdb/utils.ts";
import MealModel from '../models/MealModel.ts';


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
    const { size, mainSize, sideSize, dessertSize, ingredients, search } = req.query;
    const queryRange = size ? parseInt(size.toString()) : 30;
    const mainRange = mainSize ? parseInt(mainSize.toString()) : 30;
    const sideRange = sideSize ? parseInt(sideSize.toString()) : 15;
    const dessertRange = dessertSize ? parseInt(dessertSize.toString()) : 15;
    async function processingMeals(meals: theMealDB[]) {
      const results = await Promise.all(meals.map(async (meal) => {
        const _id = await createMeal(meal, 'themealdb');
        return {
          _id: _id.toString(),
          id: meal.idMeal,
          title: meal.strMeal,
          image: meal.strMealThumb,
          category: meal.strCategory + " " + meal.strArea,
          description: meal.strInstructions,
          source: 'themealdb',
        }
      }))
      return results;
    }
    if (search) {
      const nameResult = await getMealByName(search.toString());
      const areaResult = await getMealByFilter("area", search.toString(), queryRange);
      const categoryResult = await getMealByFilter("category", search.toString(), queryRange);
      const ingredientResult = await getMealByFilter("ingredient", search.toString(), queryRange);
      const mealReturns: any = {};
      nameResult ? mealReturns.relevant = await processingMeals(nameResult) : null;
      areaResult ? mealReturns.area = await processingMeals(areaResult) : null;
      categoryResult ? mealReturns.category = await processingMeals(categoryResult) : null;
      ingredientResult ? mealReturns.ingredient = await processingMeals(ingredientResult) : null;
      return res.json(mealReturns).status(StatusCodes.OK);
    }
    else {
      const uniqueCheck = new Set<string>([]);
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
        randomMeals: await processingMeals(randomMeals),
        sideMeals: await processingMeals(sideMeals),
        mainMeals: await processingMeals(mainMeals),
        dessertMeals: await processingMeals(dessertMeals),
        suggestedMeals: await processingMeals(suggestedMeals),
      }
      return res.json(mealsReturn).status(StatusCodes.OK);
    }
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

    const { search } = req.query;
    const queryAllergy = allergy.reduce((acc: string, curr: string) => `${acc},${curr}`, "");
    const queryDiet = diet.reduce((acc: string, curr: string) => `${acc},${curr}`, "");


    async function processingMeals(meals: spoonacularDB[]) {
      const results = await Promise.all(meals.map(async (meal) => {
        const _id = await createMeal(meal, 'spoonacular');
        return {
          _id: _id.toString(),
          id: meal.id,
          title: meal.title,
          image: meal.image,
          category: meal.occasions.join(",") + " " + meal.cuisines.join(","),
          description: meal.summary,
          source: 'spoonacular',
        }
      }))
      return results;

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
    const suggestedMeals = leftOver.length !== 0 ? await getAllMealsByIngredientsAPI(
      leftOver.map((item: Ingredient) => item.name).join(","),
      20,
    ) : [];
    const mealsReturn = {
      randomMeals: await processingMeals(randomMeals.recipes),
      sideMeals: await processingMeals(sideMeals.recipes),
      mainMeals: await processingMeals(mainMeals.recipes),
      dessertMeals: await processingMeals(dessertMeals.recipes),
      suggestedMeals: await processingMeals(suggestedMeals),
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

export const getIndividualMeal = async (req: Request, res: Response) => {

  try {
    console.dir(req.params);
    if (req.user) {
      const { mealId } = req.params;
      const meal = await MealModel.findOne({
        id: mealId,
        source: 'spoonacular',
      }).populate('allIngredients');
      if (meal) {
        return res.json(meal).status(StatusCodes.OK);
      }
      try {
        const mealInfo = await getMealByIdAPI(mealId);
        const idNewMeal = await createMeal(mealInfo, 'spoonacular');
        const info = await MealModel.findById(idNewMeal).populate('allIngredients');
        return res.json(info).status(StatusCodes.OK);
      } catch (error) {
        throw new ServerError(`${error}`);
      }
    }
    else {
      const { mealId } = req.params;
      console.log(mealId);
      let meal = await MealModel.findOne({
        id: mealId,
        source: 'themealdb',
      }).populate('allIngredients');
      if (!meal) {
        const mealInfo = await getMealById(mealId);
        const idNewMeal = await createMeal(mealInfo, 'themealdb');
        meal = await MealModel.findById(idNewMeal).populate('allIngredients');
      }
      if (meal) {
        console.log("Found");
        if (meal.analyzeInstruction.length === 0) {
          const analyze = await analyzeInstruction(meal.instruction);
          meal.analyzeInstruction = analyze.parsedInstructions;
          meal.readyInMinutes = analyze.parsedInstructions.reduce(
            (acc: number, curr: any) => curr.steps ? acc + curr.steps.reduce(
              (acc: number, curr: any) => curr.length ? acc + curr.length.number : acc, 0
            ) : acc, 0
          )
          await meal.save();
        }
        return res.json(meal).status(StatusCodes.OK);
      }
      else {
        throw new ServerError("Meal not found");
      }
    }
  } catch (error) {
    throw new ServerError(`${error}`);
  }
}



