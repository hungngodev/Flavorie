// import { StatusCodes } from 'http-status-codes';
// import { Request, Response } from 'express';
import axios, { AxiosHeaders } from 'axios';
import { MealRequest, MealResponse } from '@/models/Meals';
import { gzip } from 'zlib';

// export const getAllMeals = async (req: Request, res: Response) => {
//     res.send('get all meals');
// };
// const HUNGGING_FACE_ENDPOINT="https://api.spoonacular.com/recipes/findByIngredients"
export const getAllMeals = async (ingredients: string[]) => {
    try {
        const params = new URLSearchParams({
          ingredients: ingredients.join(','),
          apiKey: `${process.env.spoonacular_API_KEY}`,
          number: '5'
        });

        const response = await axios.get(`${process.env.spoonacular_API_ENDPOINT}?${params.toString()}`);
        // console.log(response.)
        return response.data;
    } catch(error) {
        console.log('Error calling API: ', error)
        throw error;
    }
};
