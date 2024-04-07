import { Request, Response } from 'express';
import axios, { AxiosHeaders } from 'axios';
import { ServerError } from '../errors/customErrors.ts';

const vegetableIngredients: string[] = [
    "Onions",
    "Tomatoes",
    "Potatoes",
    "Carrots",
    "Garlic",
    "Bell peppers (red, green, yellow)",
    "Spinach",
    "Broccoli",
    "Mushrooms",
    "Lettuce",
    "Zucchini",
    "Cabbage",
    "Cauliflower",
    "Green beans",
    "Celery",
    "Eggplant",
    "Asparagus",
    "Peas",
    "Corn",
    "Kale",
    "Brussels sprouts",
    "Squash (butternut, acorn, spaghetti)",
    "Leeks",
    "Radishes",
    "Beetroots",
    "Turnips",
    "Fennel",
    "Swiss chard",
    "Watercress",
    "Okra",
    "Snow peas",
    "Bok choy",
    "Collard greens",
    "Shallots",
    "Sweet potatoes",
    "Parsnips",
    "Rutabagas",
    "Arugula",
    "Artichokes",
    "Radicchio"
];

export const getAllIngredientsHelper = async (ingredients: string[]) => {
    try {
        const params = new URLSearchParams({
            ingredients: ingredients.join(','),
            apiKey: `${process.env.spoonacular_API_KEY}`,
            number: '5'
        });

        const response = await axios.get(`${process.env.spoonacular_API_ENDPOINT}?${params.toString()}`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.log('Error calling API: ', error)
        throw error;
    }
};
export const getAllIngredients = async (req: Request, res: Response) => {
    const { ingredients } = req.query;
    if (!ingredients || typeof ingredients !== 'string') {
        return res.status(400).json({ message: "Ingredients required" })
    } else {
        try {
            const recipes = await getAllIngredientsHelper(ingredients.split(','))
            return res.json(recipes)
        } catch (error) {
            // return res.status(500).json({ message: `${error}` })
            throw new ServerError(`${error}`)
        }
    }
}