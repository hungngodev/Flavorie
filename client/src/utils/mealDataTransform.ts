import { Dish } from '../components/meals/ImageSlide'
import { useEffect, useState } from 'react';
import { Box, Text, Container, Flex, HStack, Heading, VStack } from '@chakra-ui/react';
interface Nutrient {
    name: string;
    amount: number;
    unit: string;
    percentOfDailyNeeds: number;
}

interface CaloricBreakdown {
    percentProtein: number;
    percentFat: number;
    percentCarbs: number;
}

interface WeightPerServing {
    amount: number;
    unit: string;
};

export interface Nutrition {
    nutrient: Nutrient[];
    caloricBreakdown: CaloricBreakdown;
    weightperServing: WeightPerServing;
}

export interface Ingredient {
    id: number;
    name: string;
    localizedName: string;
    image: string;
}

export interface EstimatedPrice {
    value: string;
    unit: string;
}
// export interface Ingredient {
//     id: number;
//     myCategory: string;
//     name: string;
//     amount: number;
//     unit: string;
//     price: EstimatedPrice;
//     type: string;
//     image: string;
//     nutrition: Nutrition[];
// }

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
        const bgColor = colorLevels[instructionIndex % colorLevels.length];
        const title = instruction.name;
        const description = step.step;

        // ingredients
        const ingredients = step.ingredients.map((ingredient) => ({
            ingredientImage: ingredient.image || '', // Assign empty string if image is not present
            ingredientName: ingredient.name || '', // Assign empty string if name is not present
        }));

        // equipment
        const equipment = step.equipment.map((equip) => ({
            equipmentImage: equip.image || '', // Assign empty string if image is not present
            equipmentName: equip.name || '', // Assign empty string if name is not present
        }));

        return {
            title,
            description,
            bgColor,
            ingredients,
            equipment,
        };
        });
    });
}


// export function Ingredient({ ingredient }: Ingredient) {
//     const scrollRef = useRef<HTMLDivElement | null>(null);

//     useEffect(() => {
//         if (scrollRef.current) {
//         scrollRef.current.scrollTop = 0;
//         }
//     }, []);

//     return (
        
//     )
// };

