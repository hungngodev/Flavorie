import { Request, Response } from 'express';
import axios, { AxiosHeaders } from 'axios';
import { ServerError } from '../errors/customErrors.ts';


export const getAllMealsHelper = async (ingredients: string[]) => {
    try {
        const params = new URLSearchParams({
            ingredients: ingredients.join(','),
            apiKey: `${process.env.spoonacular_API_KEY}`,
            number: '5'
        });

        const response = await axios.get(`${process.env.spoonacular_API_ENDPOIN + "/recipes/findByIngredients"}?${params.toString()}`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.log('Error calling API: ', error)
        throw error;
    }
};
export const getAllMeals = async (req: Request, res: Response) => {
    const { ingredients } = req.query;
    if (!ingredients || typeof ingredients !== 'string') {
        return res.status(400).json({ message: "Ingredients required" })
    } else {
        try {
            const recipes = await getAllMealsHelper(ingredients.split(','))
            return res.json(recipes)
        } catch (error) {
            // return res.status(500).json({ message: `${error}` })
            throw new ServerError(`${error}`)
        }
    }
}