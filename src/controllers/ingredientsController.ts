import { Request, Response } from 'express';
import axios, { AxiosHeaders } from 'axios';
import { ServerError } from '../errors/customErrors.ts';
import { EndPoint } from '../utils/spoonEndPoint.ts';
const meatIngredients: string[] = [
    "beef", "chicken", "pork", "lamb", "fish", "shrimp", "bacon", "sausage", "ham", "turkey",
    "duck", "veal", "venison", "rabbit", "quail", "salmon", "tilapia", "cod", "trout", "lobster",
    "crab", "clams", "mussels", "oysters", "scallops"
];
const vegetableIngredients: string[] = [
    "carrots", "broccoli", "spinach", "tomatoes", "potatoes", "onions", "bell peppers",
    "mushrooms", "zucchini", "cucumber", "lettuce", "cabbage", "celery", "asparagus",
    "green beans", "eggplant", "corn", "peas", "radishes", "sweet potatoes",
    "artichokes", "cauliflower", "brussels sprouts", "kale", "squash", "okra",
    "turnips", "beets", "fennel", "leeks", "rutabaga", "parsnips", "watercress",
    "bok choy", "chard", "endive", "collard greens", "arugula", "bean sprouts",
    "chives", "garlic", "ginger", "shallots", "scallions", "water chestnuts"
];

const dairyIngredients: string[] = [
    "milk", "cheese", "butter", "yogurt", "cream", "sour cream", "cream cheese",
    "cottage cheese", "whipped cream", "buttermilk", "evaporated milk", "condensed milk",
    "half-and-half", "powdered milk", "ghee", "kefir", "ricotta", "mascarpone",
    "blue cheese", "feta cheese", "goat cheese", "mozzarella", "cheddar",
    "parmesan", "provolone", "swiss cheese", "brie", "camembert", "gouda",
    "havarti", "monterey jack", "pepper jack", "queso blanco", "romano"
];
const sauceIngredients: string[] = [
    "tomato sauce", "barbecue sauce", "soy sauce", "hot sauce", "mayonnaise",
    "mustard", "ketchup", "ranch dressing", "vinaigrette", "pesto sauce",
    "alfredo sauce", "hollandaise sauce", "tahini sauce", "sriracha sauce",
    "hoisin sauce", "teriyaki sauce", "chimichurri sauce", "salsa",
    "guacamole", "hummus", "tzatziki", "wasabi", "sweet and sour sauce",
    "tartar sauce", "sour cream sauce", "chili sauce", "curry sauce",
    "cranberry sauce", "honey mustard sauce", "balsamic glaze"
];
const grainIngredients: string[] = [
    "rice", "pasta", "bread", "quinoa", "barley", "oats", "couscous",
    "bulgur", "farro", "millet", "cornmeal", "wheat flour", "breadcrumbs",
    "crackers", "cereal", "amaranth", "buckwheat", "rye", "spelt",
    "teff", "sorghum", "rice flour", "corn flour", "oat flour",
    "coconut flour", "almond flour", "chia seeds", "flaxseeds", "poppy seeds",
    "sesame seeds", "sunflower seeds", "pumpkin seeds"
];

export const getAllIngredientsHelper = async (allergy: string[], diet: string[]) => {
    try {
        const params = new URLSearchParams({
            apiKey: `${process.env.spoonacular_API_KEY}`,
            number: '100'
        });

        const response = await axios.get(`${process.env.spoonacular_API_ENDPOINT + EndPoint.FIND_RECIPES_BY_INGREDIENTS}?${params.toString()}`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.log('Error calling API: ', error)
        throw error;
    }
};
export const getAllIngredients = async (req: Request, res: Response) => {

}