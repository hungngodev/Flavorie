import mongoose from "mongoose";

const MealSchema = new mongoose.Schema({
    userId: String, 
    title: String, 
    imageUrl: String, 
    allIngredients: [String],
    missingIngredients: [String],
    instructions: String
})
export default mongoose.model('Meals', MealSchema);