import { Types } from 'mongoose';
import IngredientModel from '../models/IngredientModel.ts';
import MatchingModel from '../models/MatchingModel.ts';
import MealModel from '../models/MealModel.ts';
import { ServerError } from '../errors/customErrors.ts';
import { findIngredientById } from '../services/spoonacular/spoonacularServices.ts';

export const createMeal = async (data: any, source: string): Promise<Types.ObjectId> => {
    let newMeal;
    const foundMeal = await MealModel.findOne({
        id: (source === 'themealdb' ? data.idMeal.toString() : data.id.toString()),
        source: source,
    });
    if (foundMeal) return foundMeal._id;
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
                    const ingredient = await IngredientModel.findById(idMap);
                    if (!ingredient) {
                        throw new ServerError('Ingredient not matching of ThemealDB in DB');
                    }
                    newMeal.allIngredients.push(new Types.ObjectId(idMap.toString()));
                    const number = key.split('strIngredient')[1];
                    const measure = mealData[`strMeasure${number}`];
                    newMeal.amount.set(ingredient.name, measure ?
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
            analyzeInstruction: mealData.analyzedInstructions,
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
            if (ingredient.id === -1) {
                console.log("Ingredient not valid")
                continue;
            }
            if (matchingIngredient) {
                newMeal.allIngredients.push(matchingIngredient);
                newMeal.amount.set(matchingIngredient.name, ingredient.original);
            }
            else {
                console.log('Spoonacular Missing Ingredient');
                console.dir(ingredient);
                try {
                    const newIngredient = await findIngredientById("", ingredient.id);
                    newMeal.allIngredients.push(newIngredient);
                    newMeal.amount.set(newIngredient.name, ingredient.original);
                }
                catch (error) {
                    console.log('Ingredient not found');
                    console.dir(ingredient);
                }
            }

        }
        await newMeal.save();
    }
    return newMeal._id;
}