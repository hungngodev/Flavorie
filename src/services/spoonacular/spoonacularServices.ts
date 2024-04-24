import axios from 'axios';
import { ServerError } from '../../errors/customErrors.ts';
import Ingredients from '../../models/IngredientsModel.ts';
import ApiTrack from '../../models/ApiTrack.ts';

import dotenv from 'dotenv';
import { number } from 'zod';
import e from 'express';
dotenv.config();

export const EndPoint = {
    FIND_RECIPES_BY_INGREDIENTS: '/recipes/findByIngredients',
    FIND_INGREDIENTS: '/food/ingredients/search',
    FIND_INGREDIENTS_BY_ID: (id: string) => `/food/ingredients/${id}/information`,
    RANDOM_RECIPES: '/recipes/random',
    FIND_RECIPES_ID: (id: string) => `/recipes/${id}/information`,
}

const baseURL = axios.create(
    {
        baseURL: process.env.spoonacular_API_ENDPOINT || '',
    }
)

const arrKey = [
    process.env.spoonacular_API_KEY,
    process.env.spoonacular_API_KEY_2,
    process.env.spoonacular_API_KEY_3,
    process.env.spoonacular_API_KEY_4,
    process.env.spoonacular_API_KEY_5,
    process.env.spoonacular_API_KEY_6,
    process.env.spoonacular_API_KEY_7,
];

export const baseCall = async (url: string, query: Record<string, any>, devAPIkey?: string) => {
    let SpoonacularTrack = await ApiTrack.findOne({ serviceName: 'Spoonacular' });
    if (!SpoonacularTrack) {
        SpoonacularTrack = new ApiTrack({ serviceName: 'Spoonacular', usageCount: 0, currentKey: 0, callPerMin: 0, updatedAt: new Date(), lastMinute: new Date() });
    }
    let { usageCount, currentKey, callPerMin } = SpoonacularTrack;

    const maxCall = (process.env.spoonacular_max_call ? parseInt(process.env.spoonacular_max_call) : 130) - 1;
    const numberOfKey = (process.env.spoonacular_total_key ? parseInt(process.env.spoonacular_total_key) : 5);
    const rate = (process.env.spoonacular_rate ? parseInt(process.env.spoonacular_rate) : 50) - 1;

    if (SpoonacularTrack.updatedAt.getDay() != new Date().getDay()) {
        usageCount = 0;
        currentKey = 0;
    }
    if (Math.abs(Number(new Date().getTime()) - Number(SpoonacularTrack.lastMinute)) > 60000) {
        callPerMin = 0;
        SpoonacularTrack.lastMinute = new Date();
    }
    if (usageCount > maxCall && currentKey < numberOfKey) {
        currentKey++;
        usageCount = 0;
    }
    if (usageCount > maxCall && currentKey >= numberOfKey - 1) {
        throw new ServerError('API limit reached');
    }
    if (callPerMin > rate && Math.abs(Number(new Date().getTime()) - Number(SpoonacularTrack.lastMinute)) < 60000) {
        throw new ServerError('API rate limit reached');
    }

    SpoonacularTrack.usageCount = usageCount + 1;
    SpoonacularTrack.currentKey = currentKey;
    SpoonacularTrack.callPerMin = callPerMin + 1;
    await SpoonacularTrack.save();

    try {
        const params = new URLSearchParams({
            apiKey: `${arrKey[currentKey]}`,
            number: '100',
            ...query,
        });
        const response = await baseURL.get(url, { params });
        return response.data;

    } catch (error) {
        throw new ServerError(`${error}`);
    }
}

export const getAllIngredientsAPI = async (allergy: string[], diet: string[], query: string) => {

    return await baseCall(EndPoint.FIND_INGREDIENTS,
        {
            query: query,
            number: '100',
            addChildren: 'true',
        }
    );
};

export const getIngredientByIdAPI = async (id: string) => {

    return await baseCall(EndPoint.FIND_INGREDIENTS_BY_ID(id), {
        amount: '100',
        unit: 'grams',
    });
}

export const getAllMealsAPI = async (ingredients: string[]) => {
    //add more fields like allergy, diet, etc
    return await baseCall(EndPoint.FIND_RECIPES_BY_INGREDIENTS, {
        ingredients: ingredients.join(','),
        number: '100',
        ranking: '1',
        ignorePantry: 'true',
    });
}

export const getRandomMealsAPI = async (includeTags?: string, excludeTags?: string) => {
    return await baseCall(EndPoint.RANDOM_RECIPES, {
        number: '30',
        tags: includeTags,
        "exclude-tags": excludeTags,
    });
}

export const addIngredient = async (cagetory: string, id: Number) => {
    const find = await Ingredients.findOne({ id: id });
    if (find) {
        return find;
    }
    else {
        const info = await getIngredientByIdAPI(`${id}`);
        const newIngredient = new Ingredients({ id: id, ...info, myCagetory: cagetory });
        await newIngredient.save();
        return newIngredient;
    }

}
interface DietDefinition {
    name: string;
    description: string;
}

const diets: DietDefinition[] = [
    { name: "Gluten Free", description: "Eliminating gluten means avoiding wheat, barley, rye, and other gluten-containing grains and foods made from them (or that may have been cross contaminated)." },
    { name: "Ketogenic", description: "The keto diet is based more on the ratio of fat, protein, and carbs in the diet rather than specific ingredients. Generally speaking, high fat, protein-rich foods are acceptable and high carbohydrate foods are not. The formula we use is 55-80% fat content, 15-35% protein content, and under 10% of carbohydrates." },
    { name: "Vegetarian", description: "No ingredients may contain meat or meat by-products, such as bones or gelatin." },
    { name: "Lacto-Vegetarian", description: "All ingredients must be vegetarian and none of the ingredients can be or contain egg." },
    { name: "Ovo-Vegetarian", description: "All ingredients must be vegetarian and none of the ingredients can be or contain dairy." },
    { name: "Vegan", description: "No ingredients may contain meat or meat by-products, such as bones or gelatin, nor may they contain eggs, dairy, or honey." },
    { name: "Pescetarian", description: "Everything is allowed except meat and meat by-products - some pescetarians eat eggs and dairy, some do not." },
    { name: "Paleo", description: "Allowed ingredients include meat (especially grass fed), fish, eggs, vegetables, some oils (e.g. coconut and olive oil), and in smaller quantities, fruit, nuts, and sweet potatoes. We also allow honey and maple syrup (popular in Paleo desserts, but strict Paleo followers may disagree). Ingredients not allowed include legumes (e.g. beans and lentils), grains, dairy, refined sugar, and processed foods." },
    { name: "Primal", description: "Very similar to Paleo, except dairy is allowed - think raw and full fat milk, butter, ghee, etc." },
    { name: "Low FODMAP", description: "FODMAP stands for 'fermentable oligo-, di-, mono-saccharides and polyols'. Our ontology knows which foods are considered high in these types of carbohydrates (e.g. legumes, wheat, and dairy products)" },
    { name: "Whole30", description: "Allowed ingredients include meat, fish/seafood, eggs, vegetables, fresh fruit, coconut oil, olive oil, small amounts of dried fruit and nuts/seeds. Ingredients not allowed include added sweeteners (natural and artificial, except small amounts of fruit juice), dairy (except clarified butter or ghee), alcohol, grains, legumes (except green beans, sugar snap peas, and snow peas), and food additives, such as carrageenan, MSG, and sulfites." }
];


const intolerances: string[] = [
    "Dairy",
    "Egg",
    "Gluten",
    "Grain",
    "Peanut",
    "Seafood",
    "Sesame",
    "Shellfish",
    "Soy",
    "Sulfite",
    "Tree Nut",
    "Wheat"
];

const cuisines: string[] = [
    "African",
    "Asian",
    "American",
    "British",
    "Cajun",
    "Caribbean",
    "Chinese",
    "Eastern European",
    "European",
    "French",
    "German",
    "Greek",
    "Indian",
    "Irish",
    "Italian",
    "Japanese",
    "Jewish",
    "Korean",
    "Latin American",
    "Mediterranean",
    "Mexican",
    "Middle Eastern",
    "Nordic",
    "Southern",
    "Spanish",
    "Thai",
    "Vietnamese"
];

const mealTypes: string[] = [
    "main course",
    "side dish",
    "dessert",
    "appetizer",
    "salad",
    "bread",
    "breakfast",
    "soup",
    "beverage",
    "sauce",
    "marinade",
    "fingerfood",
    "snack",
    "drink"
];

const recipeSortingOptions: string[] = [
    "",
    "meta-score",
    "popularity",
    "healthiness",
    "price",
    "time",
    "random",
    "max-used-ingredients",
    "min-missing-ingredients",
    "alcohol",
    "caffeine",
    "copper",
    "energy",
    "calories",
    "calcium",
    "carbohydrates",
    "carbs",
    "choline",
    "cholesterol",
    "total-fat",
    "fluoride",
    "trans-fat",
    "saturated-fat",
    "mono-unsaturated-fat",
    "poly-unsaturated-fat",
    "fiber",
    "folate",
    "folic-acid",
    "iodine",
    "iron",
    "magnesium",
    "manganese",
    "vitamin-b3",
    "niacin",
    "vitamin-b5",
    "pantothenic-acid",
    "phosphorus",
    "potassium",
    "protein",
    "vitamin-b2",
    "riboflavin",
    "selenium",
    "sodium",
    "vitamin-b1",
    "thiamin",
    "vitamin-a",
    "vitamin-b6",
    "vitamin-b12",
    "vitamin-c",
    "vitamin-d",
    "vitamin-e",
    "vitamin-k",
    "sugar",
    "zinc"
];