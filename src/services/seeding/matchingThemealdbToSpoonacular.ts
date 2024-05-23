import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { NotFoundError, ServerError } from '../../errors/customErrors.ts';
import Progress from '../../models/ProgressSeed.ts';
import { IngredientBank } from '../../utils/queryBank.ts';
import { findIngredientById, getAllIngredientsAPI } from '../spoonacular/spoonacularServices.ts';

dotenv.config();

const rateWait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

await mongoose.connect(process.env.MONGODB_URL || '', {});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

async function saveProgress() {

}

process.stdin.resume();
process.on('SIGINT', async function () {
    console.log("  ----> Stopping the matching process...");
    await saveProgress();
    await mongoose.connection.close();
    process.exit();
});



await mongoose.connection.close();
console.log("Matching completed");
process.exit();