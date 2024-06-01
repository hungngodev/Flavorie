import { Dish } from '../components/meals/ImageSlide.tsx'

interface Ingredient {
    id: number;
    name: string;
    localizedName: string;
    image: string; 
}

interface Equipment {
    id: number;
    name: string;
    localizedName: string;
    image: string;
    temperature?: {
        number: number;
        unit: string;
    };
}

interface Length {
    number: number;
    unit: string;
}

interface Step {
    number: number;
    step: string;
    ingredients: Ingredient[];
    equipment: Equipment[];
    length?: Length;
}

export interface AnalyzeInstruction {
    name: string;
    steps: Step[];
}
export interface BackendData {
    title: string;
    imageUrl: string;
    allIngredients: Ingredient[];
    amount: Map<string, string>;
    tags: string[];
    source: 'themealdb' | 'spoonacular' | 'user';
    instruction: string;
    analyzeInstruction: AnalyzeInstruction[];
    id: string;
    videoLink?: string;
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
}

export function transformToDishes(analyzeInstruction: AnalyzeInstruction[]): Dish[] {
    const colorLevels = ['base.50', 'base.100', 'base.200', 'base.300', 'base.400', 'base.500', 'base.600'];

    return analyzeInstruction.flatMap((instruction, instructionIndex) => {
        return instruction.steps.map((step) => {
        const bgColor = colorLevels[(instructionIndex) % colorLevels.length];
        const title = instruction.name; 
        return {
            title,
            description: step.step,
            image: step.ingredients.length > 0 ? step.ingredients[0].image : '',
            bgColor,
        };
        });
    });
}

