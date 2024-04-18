import axios from 'axios';
import { ServerError } from '../errors/customErrors.ts';
import Ingredients from '../models/Ingredients.ts';
import ApiTrack from '../models/ApiTrack.ts';

import dotenv from 'dotenv';
dotenv.config();

export const EndPoint = {
    FIND_RECIPES_BY_INGREDIENTS: '/recipes/findByIngredients',
    FIND_INGREDIENTS: '/food/ingredients/search',
    FIND_INGREDIENTS_BY_ID: (id: string) => `/food/ingredients/${id}/information`,
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
];

export const baseCall = async (url: string, query: Record<string, any>, devAPIkey?: string) => {
    let SpoonacularTrack = await ApiTrack.findOne({ serviceName: 'Spoonacular' });
    if (!SpoonacularTrack) {
        SpoonacularTrack = new ApiTrack({ serviceName: 'Spoonacular', lastUsed: new Date(), usageCount: 0, currentKey: 0 });
    }
    let { usageCount, currentKey } = SpoonacularTrack;

    const maxCall = (process.env.spoonacular_max_call ? parseInt(process.env.spoonacular_max_call) : 130) - 1;
    const numberOfKey = (process.env.spoonacular_total_key ? parseInt(process.env.spoonacular_total_key) : 5);
    const rate = (process.env.spoonacular_rate ? parseInt(process.env.spoonacular_rate) : 50) - 1;

    if (usageCount > maxCall && currentKey == numberOfKey) {
        throw new ServerError('API limit reached');
    }
    if (usageCount > rate && Math.abs(Number(new Date().getTime()) - Number(SpoonacularTrack.updatedAt)) < 60000) {
        throw new ServerError('API rate limit reached');
    }
    if (usageCount > maxCall && currentKey < numberOfKey) {
        SpoonacularTrack.currentKey = currentKey++;
        SpoonacularTrack.usageCount = 0;
    }

    SpoonacularTrack.usageCount = usageCount + 1;
    SpoonacularTrack.save();
    console.log('currentKey', arrKey[currentKey]);
    console.log('usageCount', usageCount);
    return { data: 'test' }
    // try {
    //     const params = new URLSearchParams({
    //         apiKey: `${arrKey[currentKey]}`,
    //         number: '100',
    //         ...query,
    //     });
    //     const response = await baseURL.get(url, { params });
    //     return response.data;
    // } catch (error) {
    //     throw new ServerError(`${error}`);
    // }
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
    return await baseCall(EndPoint.FIND_RECIPES_BY_INGREDIENTS, {
        ingredients: ingredients.join(','),
    });
}

export const addIngredient = async (ingredientInfo: any, id: Number) => {
    const find = await Ingredients.findOne({ id: id });
    if (find) {
        return find;
    }
    else {
        const newIngredient = new Ingredients({ id: id, ...ingredientInfo });
        await newIngredient.save();
        return newIngredient;
    }

}