/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ServerError } from "../errors/customErrors.ts";
import MealModel from "../models/MealModel.ts";
import User from "../models/UserModel.ts";
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
    const allergy = [];
    const diet = [];
    let leftOver: string[] = [];
    if (req.user) {
      const thisUser = await User.findOne({ _id: req.user.userId });
      if (thisUser) {
        allergy.push(...thisUser.allergy);
        diet.push(...thisUser.diet);
        const myLeftOver = JSON.parse(
          JSON.stringify(await getUserItems(req.user.userId, "leftOver")),
        );
        leftOver = myLeftOver.map((item: any) =>
          item.leftOver.name.toString().toLowerCase(),
        );
      }
    }
    const { search } = req.query;
    const queryAllergy = allergy
      .reduce(
        (acc: string, curr: string) =>
          `${curr.toString().toLowerCase()},${acc}`,
        "",
      )
      .slice(0, -1);
    const queryDiet = diet
      .reduce(
        (acc: string, curr: string) =>
          `${curr.toString().toLowerCase()}|${acc}`,
        "",
      )
      .slice(0, -1);

    const likedMeals = await getUserItems(req.user.userId, "likedMeal");

    async function processingMeals(meals: spoonacularDB[]) {
      const results: any = await Promise.all(
        meals.map(async meal => {
          const _id = await createMeal(meal, "spoonacular");
          const thisMeal =
            await MealModel.findById(_id).populate("allIngredients");
          let percentOfEnough = 0;
          if (thisMeal) {
            percentOfEnough = Math.round(
              (thisMeal.allIngredients.reduce(
                (acc: number, curr: any) =>
                  acc +
                  (leftOver.includes(curr.name.toString().toLowerCase())
                    ? 1
                    : 0),
                0,
              ) /
                thisMeal.allIngredients.length) *
                100,
            );
          }
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
            percentOfEnough,
          };
        }),
      );
      return results;
    }
    if (search) {
      const searchResult = await getAllMealsComplexSearch(
        search.toString().toLowerCase(),
        queryDiet,
        queryAllergy,
        "meta-score",
        30,
      );
      const mealReturns: any = {};
      if (searchResult && searchResult.results.length) {
        mealReturns.relevant = await processingMeals(searchResult.results);
      }

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
        ? await Promise.all(
            (await getAllMealsByIngredientsAPI(leftOver.join(","), 20)).map(
              async (meal: any) => {
                const findExistingMeal = await MealModel.findOne({
                  id: meal.id.toString(),
                  source: "spoonacular",
                });
                return {
                  _id: findExistingMeal ? findExistingMeal._id : null,
                  id: meal.id,
                  title: meal.title,
                  image: meal.image,
                  description: findExistingMeal
                    ? findExistingMeal.description
                    : mealPrompts[
                        Math.floor(Math.random() * mealPrompts.length)
                      ],
                  source: "spoonacular",
                  liked: findExistingMeal ? findExistingMeal.numberOfLiked : 0,
                  percentOfEnough: Math.round(
                    (meal.usedIngredientCount /
                      (meal.usedIngredientCount + meal.missedIngredientCount)) *
                      100,
                  ),
                };
              },
            ),
          )
        : [];
    const mealsReturn = {
      "Main Meals": await processingMeals(mainMeals.recipes),
      "Random Meals": await processingMeals(randomMeals.recipes),
      "Suggested for you": suggestedMeals,
      "Side Meals": await processingMeals(sideMeals.recipes),
      "Dessert Meals": await processingMeals(dessertMeals.recipes),
    };
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

const mealPrompts: string[] = [
  "This scrumptious dish is made with the freshest ingredients you have at home, promising a delightful and fulfilling meal. Relish the harmony of flavors and textures for any special occasion.",
  "Enjoy this delectable meal crafted from fresh, high-quality ingredients you already have. It offers a perfect blend of tastes and textures for a memorable dining experience.",
  "This mouthwatering recipe uses fresh ingredients from your kitchen to create a meal that's both delicious and satisfying. Savor the unique flavors and textures for any event.",
  "Experience the joy of a homemade meal with fresh, readily available ingredients. This dish combines delightful flavors and textures, making it an excellent choice for any celebration.",
  "This flavorful dish is prepared with fresh ingredients from your pantry, ensuring a delicious and enjoyable meal. Discover the unique combination of flavors and textures for any occasion.",
  "Crafted from the freshest ingredients you have on hand, this meal offers a delightful blend of flavors and textures. Perfect for enjoying on any special occasion.",
  "Enjoy a delightful meal made with fresh ingredients you have in your kitchen. This dish provides a satisfying experience with its unique flavors and textures for any event.",
  "This flavorful dish, created from fresh ingredients at home, promises a delicious and satisfying dining experience. Enjoy the exceptional blend of tastes and textures for any occasion.",
  "Create a satisfying meal with the fresh ingredients you have on hand. This recipe features a perfect mix of flavors and textures for any special occasion.",
  "Indulge in a delicious meal crafted from fresh ingredients you have available. This dish offers a delightful combination of flavors and textures ideal for any celebration.",
  "Savor a delectable meal using the freshest ingredients you have at home. This dish ensures a delightful dining experience with its unique flavors and textures for any event.",
  "Enjoy a fresh and satisfying meal made with ingredients you have on hand. This dish offers a wonderful mix of flavors and textures for any special occasion.",
  "This delightful meal, made with the freshest ingredients at your disposal, promises a tasty and fulfilling experience. Discover a unique combination of flavors and textures for any event.",
  "Prepare a delicious meal with the fresh ingredients available in your kitchen. This dish provides a satisfying blend of tastes and textures for any special occasion.",
  "This scrumptious recipe uses fresh, high-quality ingredients you have at home to create a meal that's both satisfying and delicious. Enjoy a unique experience for any occasion.",
  "Craft a flavorful and satisfying meal using the fresh ingredients you already have. This dish offers a wonderful combination of flavors and textures perfect for any celebration.",
  "Create a memorable meal with fresh ingredients from your pantry. This recipe ensures a delicious and fulfilling experience with a blend of unique flavors and textures for any event.",
  "This meal, made from the freshest ingredients on hand, provides a delightful and satisfying dining experience. Enjoy the perfect blend of flavors and textures for any special occasion.",
  "Relish a delicious meal crafted from fresh ingredients you have at home. This dish combines unique flavors and textures for a delightful experience at any celebration.",
  "This meal features fresh ingredients from your kitchen, ensuring a tasty and satisfying dining experience. Enjoy a perfect blend of flavors and textures for any occasion.",
  "Experience a delectable meal made with fresh, high-quality ingredients you have on hand. This dish offers a unique combination of flavors and textures perfect for any event.",
  "Enjoy a satisfying and delicious meal made with the freshest ingredients you have available. This recipe blends unique flavors and textures for any special occasion.",
  "This tasty dish is crafted using fresh ingredients from your kitchen, offering a satisfying and delightful meal. Discover the wonderful blend of flavors and textures for any event.",
  "Create a delicious meal with the fresh ingredients you have on hand. This dish offers a perfect balance of flavors and textures for a memorable dining experience at any occasion.",
  "This meal, made from fresh ingredients you have available, promises a delightful and fulfilling dining experience. Enjoy a unique combination of flavors and textures for any celebration.",
  "Savor a flavorful meal crafted from fresh ingredients you already have. This dish provides a satisfying experience with a perfect mix of tastes and textures for any occasion.",
  "Prepare a delicious and satisfying meal with fresh ingredients from your kitchen. This recipe features a delightful blend of flavors and textures for any special event.",
  "This mouthwatering meal is made with the freshest ingredients you have at home, offering a satisfying and enjoyable experience. Relish the unique combination of flavors and textures for any occasion.",
  "Enjoy a delectable meal created with fresh ingredients you have on hand. This dish delivers a delightful experience with its perfect blend of flavors and textures for any event.",
  "Craft a satisfying meal using the freshest ingredients from your pantry. This dish offers a delicious combination of flavors and textures for any special occasion.",
  "Experience a delightful dining experience with a meal made from fresh ingredients you already have. This dish features a unique mix of flavors and textures for any celebration.",
  "This flavorful dish uses fresh ingredients from your kitchen to create a satisfying and delicious meal. Enjoy the exceptional blend of tastes and textures for any special occasion.",
  "Relish a delicious and fulfilling meal made with fresh ingredients you have at home. This dish provides a perfect balance of flavors and textures for any event.",
  "Create a satisfying and tasty meal using the freshest ingredients available to you. This dish combines delightful flavors and textures for a memorable experience at any occasion.",
  "Enjoy a delightful and delicious meal crafted from fresh ingredients you have on hand. This recipe features a unique blend of flavors and textures for any special celebration.",
  "This meal, prepared with the freshest ingredients you have at home, offers a satisfying and delicious dining experience. Discover the perfect combination of flavors and textures for any occasion.",
  "Indulge in a scrumptious meal made with fresh ingredients from your kitchen. This dish provides a satisfying and enjoyable experience with its blend of unique flavors and textures for any event.",
  "Savor a delectable meal using fresh ingredients you have available. This dish ensures a delightful dining experience with a perfect mix of flavors and textures for any special occasion.",
  "Prepare a delicious and satisfying meal with fresh ingredients from your pantry. This recipe offers a wonderful combination of flavors and textures for any celebration.",
  "This delightful dish is crafted from the freshest ingredients you have on hand, ensuring a tasty and fulfilling meal. Enjoy a unique mix of flavors and textures for any special occasion.",
  "Experience a delectable meal made with fresh ingredients available in your kitchen. This dish offers a satisfying and delightful dining experience for any event.",
  "Create a delicious and satisfying meal using fresh ingredients you have at home. This recipe provides a perfect blend of flavors and textures for any special celebration.",
  "Relish a satisfying meal made with fresh ingredients you already have. This dish combines unique flavors and textures for a memorable experience on any occasion.",
  "Enjoy a flavorful meal crafted with the freshest ingredients you have on hand. This dish offers a delightful and fulfilling experience with its perfect combination of tastes and textures for any event.",
  "This delicious meal is made from fresh ingredients you have at home, providing a satisfying and delightful dining experience. Discover the unique blend of flavors and textures for any special occasion.",
  "Prepare a meal using fresh ingredients from your kitchen that promises a tasty and fulfilling experience. This dish offers a unique combination of flavors and textures perfect for any celebration.",
  "Savor a delectable dish crafted with the freshest ingredients you have available. This recipe ensures a delightful dining experience with a wonderful mix of flavors and textures for any event.",
  "Enjoy a satisfying and delicious meal made from fresh ingredients at home. This dish offers a perfect blend of unique flavors and textures for any special occasion.",
  "Experience a delightful meal with fresh ingredients you have on hand. This dish promises a satisfying and enjoyable dining experience with its unique combination of flavors and textures for any event.",
  "Create a delicious and fulfilling meal with the freshest ingredients from your kitchen. This dish offers a perfect balance of flavors and textures for a memorable celebration or occasion.",
  "Relish a scrumptious meal using fresh ingredients you have available. This dish provides a satisfying dining experience with a unique blend of flavors and textures for any special event.",
  "This flavorful meal is crafted with fresh ingredients from your pantry, ensuring a delicious and satisfying experience. Enjoy the perfect combination of tastes and textures for any occasion.",
  "Prepare a delectable meal with fresh ingredients you have at home. This dish features a delightful mix of flavors and textures for a memorable dining experience at any event.",
  "Indulge in a delicious and satisfying meal created from fresh ingredients you have on hand. This recipe offers a wonderful combination of flavors and textures for any special occasion.",
  "Enjoy a flavorful and fulfilling meal made with the freshest ingredients available to you. This dish combines unique tastes and textures for a delightful experience at any celebration.",
  "Craft a satisfying meal with fresh ingredients from your kitchen. This dish provides a delicious and enjoyable dining experience with its perfect blend of flavors and textures for any event.",
  "This delightful meal, made from the freshest ingredients you have at home, offers a unique combination of flavors and textures for a satisfying and memorable dining experience.",
  "Experience a scrumptious meal using fresh ingredients you have available. This dish provides a delightful and satisfying dining experience with a perfect balance of flavors and textures for any occasion.",
  "Prepare a delicious and satisfying meal with fresh ingredients from your kitchen. This recipe features a wonderful mix of flavors and textures for any special event or celebration.",
  "Enjoy a satisfying and delightful meal crafted from fresh ingredients you have at home. This dish offers a unique combination of tastes and textures perfect for any special occasion.",
  "This flavorful dish uses fresh ingredients to create a delicious and fulfilling meal. Relish the exceptional blend of flavors and textures for any celebration or event.",
  "Indulge in a delectable meal made with the freshest ingredients you have on hand. This dish promises a satisfying dining experience with its unique combination of flavors and textures for any occasion.",
  "Relish a delightful meal using fresh ingredients from your pantry. This dish offers a wonderful mix of flavors and textures for a memorable dining experience at any special event.",
  "Create a delicious and satisfying meal with fresh ingredients you have available. This dish provides a perfect balance of unique flavors and textures for any special occasion or celebration.",
  "Enjoy a flavorful and fulfilling meal crafted from the freshest ingredients you have at home. This recipe features a delightful combination of tastes and textures for any memorable event.",
  "Prepare a satisfying and delicious meal with fresh ingredients from your kitchen. This dish promises a wonderful dining experience with its unique blend of flavors and textures for any occasion.",
  "Experience a delectable meal made from fresh ingredients you already have. This dish ensures a delightful and satisfying dining experience with its perfect mix of flavors and textures for any celebration.",
  "Indulge in a delicious meal crafted with the freshest ingredients you have available. This recipe promises a unique combination of flavors and textures perfect for any occasion.",
  "Savor a scrumptious meal made with fresh ingredients from your pantry. This dish offers a satisfying and delightful dining experience with its unique blend of tastes and textures for any special event.",
  "Prepare a delightful meal using the fresh ingredients you have at home. This dish combines unique flavors and textures for a memorable dining experience at any celebration.",
  "Enjoy a satisfying and delicious meal made from fresh ingredients you already have. This recipe offers a perfect blend of flavors and textures for any special occasion or event.",
  "This meal, crafted with the freshest ingredients available in your kitchen, promises a delightful and fulfilling experience. Relish the unique combination of tastes and textures for any celebration.",
  "Indulge in a flavorful and satisfying meal made with fresh ingredients you have on hand. This dish provides a wonderful dining experience with its perfect mix of flavors and textures for any event.",
  "Create a delectable meal using the fresh ingredients available in your pantry. This dish offers a delightful blend of unique flavors and textures for any special occasion or celebration.",
  "Experience a delightful dining experience with a meal made from fresh ingredients you already have. This recipe promises a wonderful combination of tastes and textures for any memorable event.",
  "Savor a satisfying meal crafted with the freshest ingredients you have at home. This dish ensures a delightful experience with its unique blend of flavors and textures for any occasion.",
  "Prepare a delicious meal using fresh ingredients from your kitchen. This dish offers a perfect balance of flavors and textures for a memorable dining experience at any special event.",
  "Enjoy a flavorful and fulfilling meal made with fresh ingredients you have available. This recipe promises a delightful and satisfying experience with its unique combination of tastes and textures for any occasion.",
  "Create a delicious and satisfying meal using the fresh ingredients you have on hand. This dish provides a perfect blend of flavors and textures for any celebration or event.",
];
