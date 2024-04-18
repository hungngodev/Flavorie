import dotenv from 'dotenv';
import Ingredients, { Ingredient } from '../models/Ingredients.ts';
import { getAllIngredientsAPI, getIngredientByIdAPI, addIngredient } from '../services/spoonacularServices.ts';
import Progress from '../models/ProgressSeed.ts';
dotenv.config();
import mongoose from 'mongoose';

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

const fruitIngredients: string[] = [
    "apples", "bananas", "oranges", "grapes", "strawberries", "blueberries",
    "raspberries", "blackberries", "kiwi", "mango", "pineapple", "watermelon",
    "cantaloupe", "honeydew", "peaches", "plums", "cherries", "apricots",
    "pears", "lemons", "limes", "avocado", "pomegranate", "figs",
    "dates", "passion fruit", "guava", "lychee", "dragon fruit", "star fruit",
    "persimmons", "papaya", "cranberries", "gooseberries", "elderberries"
];

const nutIngredients: string[] = [
    "almonds", "walnuts", "cashews", "peanuts", "pecans", "pistachios",
    "macadamia nuts", "hazelnuts", "chestnuts", "brazil nuts", "pine nuts",
    "sesame seeds", "sunflower seeds", "pumpkin seeds", "flaxseeds", "chia seeds",
    "poppy seeds", "pepitas", "quinoa", "coconut", "nut butter"
];
export const IngredientObject = {
    meat: meatIngredients,
    vegetable: vegetableIngredients,
    dairy: dairyIngredients,
    sauce: sauceIngredients,
    grain: grainIngredients,
    fruit: fruitIngredients,
    nut: nutIngredients,
}

const seedInformation = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL || '', {});

        const db = mongoose.connection;

        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", () => {
            console.log("Database connected");
        });
        let progress = await Progress.findOne({});
        if (!progress) {
            progress = new Progress({ currentCagetory: 'meat', currentIndex: 0, name: "spoonacular" });
        }
        await progress.save();
    }
    catch (error) {
        console.log(error);
    }
    await getIngredientByIdAPI('beef');
    // const data = await getAllIngredientsAPI([], [], 'meat');
    // const result = data.results;
    // for (let i = 0; i < 1; i++) {
    //     const { id, children } = result[i];
    //     const parentIngredient = await addIngredient(result[i], id);
    //     for (let j = 0; j < 3; j++) {
    //         const childIngredient = await addIngredient(children[j], children[j].id);
    //         await childIngredient.save();
    //         parentIngredient.relevance.push(childIngredient);
    //     }
    //     await parentIngredient.save();
    // }
    // const ingredients = await Ingredients.findById("661d7d3778971335621c021d");
    // console.log(ingredients);
    // console.log(await ingredients?.populate<{ relevance: Ingredient }>('relevance'));
}

seedInformation().then(() => {
    mongoose.connection.close();
})         