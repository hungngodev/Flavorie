import mongoose, { Types } from "mongoose";

export interface Ingredient extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  id: number;
  myCagetory: string;
  original: string;
  originalName: string;
  name: string;
  amount: number;
  unit: string;
  unitShort: string;
  unitLong: string;
  possibleUnits: string[];
  estimatedCost: {
    value: number;
    unit: string;
  };
  consistency: string;
  shoppingListUnits: string[];
  aisle: string;
  image: string;
  meta: string[];
  nutrition: {
    nutrients: {
      name: string;
      amount: number;
      unit: string;
      percentOfDailyNeeds: number;
    }[];
    properties: {
      name: string;
      amount: number;
      unit: string;
    }[];
    flavonoids: {
      name: string;
      amount: number;
      unit: string;
    }[];
    caloricBreakdown: {
      percentProtein: number;
      percentFat: number;
      percentCarbs: number;
    };
    weightPerServing: {
      amount: number;
      unit: string;
    };
  };
  allergy: string[];
  diet: string[];
  categoryPath: string[];
  relevance: Types.DocumentArray<Ingredient>;
}
type IngredientModel = mongoose.Model<Ingredient>;
const IngredientSchema = new mongoose.Schema<Ingredient, IngredientModel>({
  id: Number,
  myCagetory: String,
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
    unit: String,
  },
  consistency: String,
  shoppingListUnits: [String],
  aisle: String,
  image: String,
  meta: [String],
  nutrition: {
    nutrients: [
      {
        name: String,
        amount: Number,
        unit: String,
        percentOfDailyNeeds: Number,
      },
    ],
    properties: [
      {
        name: String,
        amount: Number,
        unit: String,
      },
    ],
    flavonoids: [
      {
        name: String,
        amount: Number,
        unit: String,
      },
    ],
    caloricBreakdown: {
      percentProtein: Number,
      percentFat: Number,
      percentCarbs: Number,
    },
    weightPerServing: {
      amount: Number,
      unit: String,
    },
  },
  allergy: [String],
  diet: [String],
  categoryPath: [String],
  relevance: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
    },
  ],
});
export default mongoose.model<Ingredient, IngredientModel>(
  "Ingredient",
  IngredientSchema,
);
