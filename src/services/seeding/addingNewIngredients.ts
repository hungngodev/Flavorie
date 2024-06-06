import { Ingredient } from './../../models/IngredientModel';
import { input } from '@inquirer/prompts';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import newIngredients from './new-ingredient.js';
import IngredientModel from '../../models/IngredientModel.ts';
import MatchingModel from '../../models/MatchingModel.ts';
import { ServerError, NotFoundError } from '../../errors/customErrors.ts';
import { getAllIngredientsAPI, findIngredientById, getIngredientByIdAPI } from '../spoonacular/spoonacularServices.ts';

dotenv.config();
const listOfIngredients = newIngredients;

await mongoose.connect(process.env.MONGODB_URL || '', {});

const db = mongoose.connection;

const rateWait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
let currentMatching = await MatchingModel.findOne({ name: "spoonacular" });
if (!currentMatching) {
    currentMatching = new MatchingModel({
        progress: 0, name: "spoonacular",
        mapIngredients: {},
    });
    await currentMatching.save();
    console.log("Matching created");
}

process.stdin.resume();
process.on('SIGINT', async function () {
    console.log("  ----> Stopping the matching process...");
    await currentMatching.save();
    await mongoose.connection.close();
    process.exit();
});

const catchErrorSeedAPI = async (error: any): Promise<void> => {
    console.log("Handling error")
    if (error instanceof ServerError) {
        if (error.message === 'API limit reached') {
            console.log('API limit reached');
            await currentMatching.save();
            await mongoose.connection.close();
            process.exit();
        }
        if (error.message === 'API rate limit reached') {
            console.log('Rate limit reached')
            await rateWait(60000);
        }
        else if (error instanceof NotFoundError) {
            console.log('Not found error');
        }
        else {

            console.dir(error);
            console.log("Error occured")
            await currentMatching.save();
            await mongoose.connection.close();
        }
    }
}
const category = {
    "meat": (categoryPath: string[]) => categoryPath.some((category) => category.toLowerCase().includes("meat")),
    "vegetable": (categoryPath: string[]) => categoryPath.some((category) => category.toLowerCase().includes("vegetable")),
    "sauce": (categoryPath: string[]) => categoryPath.some((category) => category.toLowerCase().includes("sauce")),
    "fruit": (categoryPath: string[]) => categoryPath.some((category) => category.toLowerCase().includes("fruit")),
    "seafood": (categoryPath: string[]) => categoryPath.some((category) => category.toLowerCase().includes("seafood")),
    "nut": (categoryPath: string[]) => categoryPath.some((category) => category.toLowerCase().includes("nuts")),
    "spice": (categoryPath: string[]) => categoryPath.some((category) => category.toLowerCase().includes("spices")),
    "grain": (categoryPath: string[]) => categoryPath.some((category) => category.toLowerCase().includes("grains")),
}

async function matching() {
    console.log(listOfIngredients.length);
    if (!currentMatching) {
        throw new ServerError('Matching not found');
    }
    for (let z = currentMatching.progress; z < listOfIngredients.length; z++) {
        const ingredient = listOfIngredients[z];
        console.log(z + '.' + "  Ingredient To Match: " + ingredient.name);
        console.log("id: " + ingredient.id)
        const duplicateCheck = await IngredientModel.find({ id: ingredient.id + 1 - 1 });
        if (duplicateCheck.length > 1) {
            console.log("Duplicate found: " + ingredient.name);
            const shouldContinue = await input({
                message: "Continue?",
            });
            if (shouldContinue === "yes") {
                currentMatching.progress += 1;
                await currentMatching.save();
                continue;
            }
        }
        const foundIngredient = await IngredientModel.findOne({ id: ingredient.id });
        if (foundIngredient) {
            console.log("Ingredient already exists: " + ingredient.name);
            currentMatching.progress += 1;
            await currentMatching.save();
            continue;
        }
        try {
            let { results } = await getAllIngredientsAPI([], [], ingredient.name.toLowerCase(), 2);
            while (results.length === 0) {
                console.log("No results found, please try again");
                const newQuery = await input({
                    message: "Please enter a new query",
                });
                results = (await getAllIngredientsAPI([], [], newQuery, 2)).results;
            }
            console.log("Results found");
            const { id: idFirstMatch } = results[0];
            if (idFirstMatch !== ingredient.id) {
                console.log("Id mismatch");
                const shouldContinue = await input({
                    message: "skip?",
                });
                if (shouldContinue === "yes") {
                    continue;
                }
            }
            const newIngredient = await getIngredientByIdAPI(idFirstMatch);
            const categoryPath = newIngredient.categoryPath;
            let categoryMatched = "";
            for (const entries of Object.entries(category)) {
                if (entries[1](categoryPath)) {
                    categoryMatched = entries[0];
                    console.log("Category found: " + categoryMatched);
                    break;
                }
            }
            if (categoryMatched === "") {
                console.log("Category not found");
                console.log("Category path: " + categoryPath);
                const newCategory = await input({
                    message: "Please enter a category",
                });
                categoryMatched = newCategory;
            }
            const newIngredientModel = new IngredientModel(newIngredient);
            newIngredientModel.myCagetory = categoryMatched;
            await newIngredientModel.save();
            await currentMatching.save();
        }
        catch (error) {
            console.log("Error occured");
            console.dir(error);
            const shouldContinue = await input({
                message: "Continue?",
            });
            if (shouldContinue === "yes") {
                continue;
            }
            await catchErrorSeedAPI(error);
        }
        currentMatching.progress += 1;
        await currentMatching.save();

    }
}
await matching();
await mongoose.connection.close();
console.log("Matching completed");
process.exit();