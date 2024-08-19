import mongoose, { Types } from "mongoose";
import { Ingredient } from "./IngredientModel.ts";
type Source = "themealdb" | "spoonacular" | "user";
export interface Meal extends mongoose.Document {
  title: string;
  imageUrl: string;
  allIngredients: Types.DocumentArray<Ingredient>;
  instruction: string;
  analyzeInstruction: {
    name: string;
    steps: {
      number: number;
      step: string;
      ingredients: {
        id: number;
        name: string;
        localizedName: string;
        image: string;
      }[];
      equipment: {
        id: number;
        name: string;
        localizedName: string;
        image: string;
        temparture: {
          number: number;
          unit: string;
        };
      }[];
      length: {
        number: number;
        unit: string;
      };
    }[];
  }[];

  source: Source;
  id: string;
  tags: string[];
  amount: Map<string, string>;
  videoLink: string;

  description: string;
  price: string;
  readyInMinutes: string;
  servings: number;
  dishTypes: string[];
  taste: {
    sweetness: number;
    saltiness: number;
    sourness: number;
    bitterness: number;
    savoriness: number;
    fattiness: number;
    spiciness: number;
  };

  numberOfLiked: number;
}
type MealModel = mongoose.Model<Meal>;

const MealSchema = new mongoose.Schema<Meal, MealModel>({
  title: {
    type: String,
  },
  imageUrl: String,
  allIngredients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
    },
  ],
  amount: {
    type: Map,
    of: {
      type: String,
    },
  },
  tags: {
    type: [String],
    required: true,
  },
  numberOfLiked: {
    type: Number,
    default: 0,
  },
  source: {
    type: String,
    enum: ["themealdb", "spoonacular", "user"],
    required: true,
  },
  instruction: String,
  analyzeInstruction: [
    {
      name: String,
      steps: [
        {
          number: Number,
          step: String,
          ingredients: [
            {
              id: Number,
              name: String,
              localizedName: String,
              image: String,
            },
          ],
          equipment: [
            {
              id: Number,
              name: String,
              localizedName: String,
              image: String,
              temparture: {
                number: Number,
                unit: String,
              },
            },
          ],
          length: {
            number: Number,
            unit: String,
          },
        },
      ],
    },
  ],
  id: {
    type: String,
    required: true,
  },
  videoLink: String,

  description: String,
  price: String,
  readyInMinutes: String,
  servings: Number,
  dishTypes: [String],
  taste: {
    sweetness: Number,
    saltiness: Number,
    sourness: Number,
    bitterness: Number,
    savoriness: Number,
    fattiness: Number,
    spiciness: Number,
  },
});

export default mongoose.model<Meal>("Meal", MealSchema);
