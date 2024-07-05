import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ServerError } from "../errors/customErrors.ts";
import { Ingredient } from "../models/IngredientModel.ts";
import MealModel from "../models/MealModel.ts";
import { createMeal } from "../services/mealServices.ts";
import {
  analyzeInstruction,
  getAllMealsByIngredientsAPI,
  getAllMealsComplexSearch,
  getMealByIdAPI,
  getMealsAutoCompleteAPI,
  getRandomMealsAPI,
} from "../services/spoonacular/spoonacularServices.ts";
import {
  Areas,
  Categories,
  Ingredients,
  MainCategories,
} from "../services/themealdb/data.ts";
import {
  getMealByFilter,
  getMealById,
  getMealByName,
  getRandomMeal,
} from "../services/themealdb/themealdbServices.ts";
import { getRandomKey } from "../services/themealdb/utils.ts";
import { getUserItems } from "../services/userServices.ts";

type theMealDB = {
  strMeal: string;
  idMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
};
export const getRandomMealsUnauthenticated = async (
  req: Request,
  res: Response,
): Promise<Response<any, Record<string, any>>> => {
  try {
    const { size, mainSize, sideSize, dessertSize, ingredients, search } =
      req.query;
    const queryRange = size ? parseInt(size.toString()) : 30;
    const mainRange = mainSize ? parseInt(mainSize.toString()) : 30;
    const sideRange = sideSize ? parseInt(sideSize.toString()) : 15;
    const dessertRange = dessertSize ? parseInt(dessertSize.toString()) : 15;
    async function processingMeals(meals: theMealDB[]) {
      const results = await Promise.all(
        meals.map(async meal => {
          const _id = await createMeal(meal, "themealdb");
          const thisMeal = await MealModel.findById(_id);
          return {
            _id: _id.toString(),
            id: meal.idMeal,
            title: meal.strMeal,
            image: meal.strMealThumb,
            category: meal.strCategory + " " + meal.strArea,
            description: meal.strInstructions,
            source: "themealdb",
            numberOfLiked: thisMeal?.numberOfLiked,
          };
        }),
      );
      return results;
    }
    if (search || search === "") {
      const nameResult = await getMealByName(search.toString().toLowerCase());
      const areaResult = await getMealByFilter(
        "area",
        search.toString(),
        queryRange,
      );
      const categoryResult = await getMealByFilter(
        "category",
        search.toString(),
        queryRange,
      );
      const ingredientResult = await getMealByFilter(
        "ingredient",
        search.toString(),
        queryRange,
      );
      const mealReturns: any = {};
      nameResult && nameResult.length
        ? (mealReturns.relevant = await processingMeals(nameResult))
        : null;
      areaResult && areaResult.length
        ? (mealReturns.area = await processingMeals(areaResult))
        : null;
      categoryResult && categoryResult.length
        ? (mealReturns.category = await processingMeals(categoryResult))
        : null;
      ingredientResult && ingredientResult.length
        ? (mealReturns.ingredient = await processingMeals(ingredientResult))
        : null;
      return res.json(mealReturns).status(StatusCodes.OK);
    } else {
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
          const mealList = await getMealByFilter(
            "ingredient",
            ingredient.toString(),
          );
          suggestedMeals.push(mealList);
        }
      }
      const mealsReturn = {
        randomMeals: await processingMeals(randomMeals),
        sideMeals: await processingMeals(sideMeals),
        mainMeals: await processingMeals(mainMeals),
        dessertMeals: await processingMeals(dessertMeals),
        suggestedMeals: await processingMeals(suggestedMeals),
      };
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
};
export const getRanDomMealsAuthenticated = async (
  req: Request,
  res: Response,
) => {
  try {
    const { allergy, diet, leftOver } = req.body;
    console.log(leftOver);
    const { search } = req.query;
    const queryAllergy = allergy.reduce(
      (acc: string, curr: string) => `${acc},${curr}`,
      "",
    );
    const queryDiet = diet.reduce(
      (acc: string, curr: string) => `${acc},${curr}`,
      "",
    );
    const likedMeals = await getUserItems(req.user.userId, "likedMeal");
    async function processingMeals(meals: spoonacularDB[]) {
      const results: any = await Promise.all(
        meals.map(async meal => {
          const _id = await createMeal(meal, "spoonacular");
          const thisMeal = await MealModel.findById(_id);
          return {
            _id: _id.toString(),
            id: meal.id,
            title: meal.title,
            image: meal.image,
            category: meal.occasions.join(",") + " " + meal.cuisines.join(","),
            description: meal.summary,
            source: "spoonacular",
            numberOfLiked: thisMeal?.numberOfLiked,
            liked: likedMeals.find(
              (item: any) => item.itemId.toString() === _id.toString(),
            ),
          };
        }),
      );
      return results;
    }
    if (search) {
      const searchResult = await getAllMealsComplexSearch(
        search.toString().toLowerCase(),
        diet,
        allergy,
        "meta-score",
        30,
      );
      const mealReturns: any = {};
      searchResult && searchResult.results.length
        ? (mealReturns.relevant = searchResult.results.map(
            (meal: spoonacularDB) => {
              return {
                id: meal.id,
                title: meal.title,
                image: meal.image,
                description: meal.summary,
              };
            },
          ))
        : null;
      return res.json(mealReturns).status(StatusCodes.OK);
    }

    const randomMeals = await getRandomMealsAPI(queryDiet, queryAllergy, 30);
    const mainMeals = await getRandomMealsAPI(
      queryDiet + ",main course",
      queryAllergy,
      30,
    );
    const sideMeals = await getRandomMealsAPI(
      queryDiet + ",side dish",
      queryAllergy,
      15,
    );
    const dessertMeals = await getRandomMealsAPI(
      queryDiet + ",dessert",
      queryAllergy,
      15,
    );
    const suggestedMeals =
      leftOver.length !== 0
        ? await getAllMealsByIngredientsAPI(
            leftOver.map((item: Ingredient) => item.name).join(","),
            20,
          )
        : [];
    const mealsReturn = {
      randomMeals: await processingMeals(randomMeals.recipes),
      sideMeals: await processingMeals(sideMeals.recipes),
      mainMeals: await processingMeals(mainMeals.recipes),
      dessertMeals: await processingMeals(dessertMeals.recipes),
      suggestedMeals: await processingMeals(suggestedMeals),
    };
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
};

export const getAutoComplete = async (req: Request, res: Response) => {
  let { query } = req.query;
  if (!query) {
    return res.json([]).status(StatusCodes.OK);
  }
  query = query.toString().toLowerCase().trim();
  const numsAutoComplete = 7;
  if (!req.user) {
    const results: { title: string }[] = [];
    const adding = (value: string) =>
      results.length < numsAutoComplete &&
      value.toLowerCase().startsWith(query.toString().toLowerCase())
        ? results.push({ title: value.toLowerCase().trim() })
        : null;
    MainCategories.forEach(adding);
    Categories.forEach(adding);
    Areas.forEach(adding);
    Ingredients.forEach(adding);
    const matching = await MealModel.find({
      title: { $regex: `^${query}`, $options: "i" },
    }).limit(numsAutoComplete);
    matching.forEach(meal => {
      results.length < numsAutoComplete && results.push({ title: meal.title });
    });
    return res.json(results).status(StatusCodes.OK);
  }
  console.log("AutoComplete");
  try {
    const autoComplete = await getMealsAutoCompleteAPI(
      query.toString(),
      numsAutoComplete,
    );
    return res.json(autoComplete).status(StatusCodes.OK);
  } catch (error) {
    throw new ServerError(`${error}`);
  }
};

export const getIndividualMeal = async (req: Request, res: Response) => {
  try {
    if (req.user) {
      const { mealId } = req.params;
      const meal = await MealModel.findOne({
        id: mealId,
        source: "spoonacular",
      }).populate("allIngredients");
      if (meal && meal.analyzeInstruction) {
        return res.json(meal).status(StatusCodes.OK);
      }
      try {
        const mealInfo = await getMealByIdAPI(mealId);
        const idNewMeal = await createMeal(mealInfo, "spoonacular");
        const info =
          await MealModel.findById(idNewMeal).populate("allIngredients");
        return res.json(info).status(StatusCodes.OK);
      } catch (error) {
        throw new ServerError(`${error}`);
      }
    } else {
      const { mealId } = req.params;
      let meal = await MealModel.findOne({
        id: `${mealId}`,
        source: "themealdb",
      }).populate("allIngredients");
      if (!meal) {
        console.log("Not found Meal id: ", mealId);
        const mealInfo = await getMealById(mealId);
        const idNewMeal = await createMeal(mealInfo, "themealdb");
        meal = await MealModel.findById(idNewMeal).populate("allIngredients");
      }
      if (meal) {
        console.log("Found");
        if (meal.analyzeInstruction.length === 0) {
          const analyze = await analyzeInstruction(meal.instruction);
          meal.analyzeInstruction = analyze.parsedInstructions;
          meal.readyInMinutes = analyze.parsedInstructions.reduce(
            (acc: number, curr: any) =>
              curr.steps
                ? acc +
                  curr.steps.reduce(
                    (acc: number, curr: any) =>
                      curr.length ? acc + curr.length.number : acc,
                    0,
                  )
                : acc,
            0,
          );
          await meal.save();
        }
        return res.json(meal).status(StatusCodes.OK);
      } else {
        throw new ServerError("Meal not found");
      }
    }
  } catch (error) {
    throw new ServerError(`${error}`);
  }
};
