import axios from 'axios';
import { ServerError } from '../errors/customErrors.ts';
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

export const baseCall = async (url: string, query: Record<string, any>) => {
    try {
        const params = new URLSearchParams({
            apiKey: `${process.env.spoonacular_API_KEY}`,
            number: '100',
            ...query,
        });
        const response = await baseURL.get(url, { params });
        return response.data;
    } catch (error) {
        throw new ServerError(`${error}`);
    }
}

export const getAllIngredientsAPI = async (allergy: string[], diet: string[]) => {

    return baseCall(EndPoint.FIND_INGREDIENTS,
        {
            query: 'meat',
            number: '100',
            addChildren: 'true',
        }
    );
};

export const getIngredientByIdAPI = async (id: string) => {

    return baseCall(EndPoint.FIND_INGREDIENTS_BY_ID(id), {});
}

export const getAllMealsAPI = async (ingredients: string[]) => {
    return baseCall(EndPoint.FIND_RECIPES_BY_INGREDIENTS, {
        ingredients: ingredients.join(','),
    });
}
