import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
    _id: Number,
    original: String,
    originalName: String,
    name: String,
    amount: Number,
    unit: String,
    unitShort: String,
    unitLong: String,
    possibleUnits: [String],
    estimatedCost: {
        value: Number,
        unit: String
    },
    consistency: String,
    shoppingListUnits: [String],
    aisle: String,
    image: String,
    meta: [String],
    nutrition: {
        nutrients: [{
            name: String,
            amount: Number,
            unit: String,
            percentOfDailyNeeds: Number
        }],
        properties: [{
            name: String,
            amount: Number,
            unit: String
        }],
        flavonoids: [{
            name: String,
            amount: Number,
            unit: String
        }],
        caloricBreakdown: {
            percentProtein: Number,
            percentFat: Number,
            percentCarbs: Number
        },
        weightPerServing: {
            amount: Number,
            unit: String
        }
    },
    categoryPath: [String]
})
export default mongoose.model('Ingredient', IngredientSchema)