import mongoose from "mongoose";

const MealSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, 
    title: String, 
    imageUrl: String, 
    allIngredients:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Ingredient'
    }],
    missingIngredients: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Ingredient'
    }],
    instructions: String
})
export default mongoose.model('Meal', MealSchema);