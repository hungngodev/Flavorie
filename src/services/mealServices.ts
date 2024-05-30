import { Types } from 'mongoose';
import IngredientModel from '../models/IngredientModel.ts';
import MatchingModel from '../models/MatchingModel.ts';
import MealModel from '../models/MealModel.ts';
import { analyzeInstruction } from '../services/spoonacular/spoonacularServices.ts'

export const createMeal = async (data: any, source: string): Promise<Types.ObjectId> => {
    let newMeal;
    if (source === 'themealdb') {
        const mealData = data;
        const matchingThemealDB = await MatchingModel.findOne({
            name: 'themealdb'
        });
        newMeal = new MealModel({
            id: mealData.idMeal,
            source: source,
            title: mealData.strMeal,
            imageUrl: mealData.strMealThumb,
            instruction: mealData.strInstructions,
            tags: [
                ...(mealData.strTags ? mealData.strTags.split(',') : []),
                ...(mealData.strCategory ? mealData.strCategory.split(',') : []),
                ...(mealData.strArea ? mealData.strArea.split(',') : []),
            ].map(e => e.toLowerCase()),
            videoLink: mealData.strYoutube,
            analyzeInstruction: [],
            amount: {},
        });

        const map = matchingThemealDB?.mapIngredients;

        for (const key of Object.keys(mealData)) {
            if (key.includes("strIngredient")
                && mealData[key] !== ''
                && mealData[key] !== null
            ) {
                const idMap = map?.get(mealData[key].toLowerCase());
                if (idMap) {
                    newMeal.allIngredients.push(idMap)
                    const number = key.split('strIngredient')[1];
                    const measure = mealData[`strMeasure${number}`];
                    newMeal.amount.set(idMap.toString(), measure ?
                        measure : '');
                }
                else {
                    console.log('Themealdb Missing');
                    console.log(mealData[key]);
                }
            }
        }
        await newMeal.save();
    }
    else {
        const mealData = data;
        newMeal = new MealModel({
            id: mealData.id.toString(),
            source: source,
            title: mealData.title,
            imageUrl: mealData.image,
            price: mealData.pricePerServing / 100,
            readyInMinutes: mealData.readyInMinutes,
            servings: mealData.servings,
            tags: [
                ...mealData.diets,
                ...mealData.cuisines,
                ...mealData.occasions,
            ].map(e => e.toLowerCase()),
            dishTypes: mealData.dishTypes,
            description: mealData.summary,
            videoLink: mealData.sourceUrl,
            instructions: mealData.instructions,
            analyzeInstruction: mealData.analyzeInstructions,
            amount: {},
        });
        for (const key of Object.keys(mealData)) {
            if (typeof mealData[key] === 'boolean' && mealData[key] === true) {
                newMeal.tags.push(key)
            }
        }
        for (const ingredient of mealData.extendedIngredients) {
            const matchingIngredient = await IngredientModel.findOne({
                id: ingredient.id
            });
            if (matchingIngredient) {
                newMeal.allIngredients.push(matchingIngredient._id);
                newMeal.amount.set(matchingIngredient._id.toString(), ingredient.
                    Ingredient.original);
            }
            else {
                console.log('Spoonacular Missing');
            }

        }
        await newMeal.save();
    }
    return newMeal._id;
}