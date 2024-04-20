const meatIngredients: string[] = [
    "beef", "chicken", "pork", "lamb", "fish", "shrimp", "bacon", "sausage", "ham", "turkey",
    "duck", "veal", "venison", "rabbit", "quail"
];
const seaFoodIngredients: string[] = [
    "salmon", "tuna", "cod", "trout", "lobster",
    "crab", "clams", "mussels", "oysters", "scallops", "squid", "octopus", "shrimp",
];

const vegetableIngredients: string[] = [
    "carrots", "broccoli", "spinach", "tomatoes", "potatoes", "onions", "bell peppers",
    "mushrooms", "zucchini", "cucumber", "lettuce", "cabbage", "celery", "asparagus",
    "green beans", "eggplant", "corn", "peas", "radishes", "sweet potatoes",
    "artichokes", "cauliflower", "brussels sprouts", "kale", "squash", "okra",
    "turnips", "bok choy", "chard", "bean sprouts", "chives", "garlic", "ginger", "shallots", "scallions", "water chestnuts", "beets", "fennel", "leeks", "rutabaga", "endive", "collard greens", "arugula",
];

const dairyIngredients: string[] = [
    "milk", "cheese", "butter", "yogurt", "cream", "sour cream", "cream cheese",
    "cottage cheese", "whipped cream", "buttermilk", "evaporated milk", "condensed milk",
    "half-and-half", "powdered milk", "ghee", "kefir", "ricotta", "mascarpone",
    "blue cheese", "feta cheese", "goat cheese", "mozzarella", "cheddar",
    "parmesan", "provolone", "swiss cheese", "brie", "camembert", "gouda",
    "havarti", "monterey jack", "pepper jack", "queso blanco", "romano"
];

const eggIngredients: string[] = [
    "eggs", "egg whites", "egg yolks", "hard-boiled eggs", "scrambled eggs",
    "fried eggs", "poached eggs", "deviled eggs", "omelette", "frittata",
    "quiche", "souffle", "custard", "mousse", "meringue", "mayonnaise"
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

const spiceIngredients: string[] = [
    "salt", "pepper", "cumin", "paprika", "cayenne", "chili powder",
    "garlic powder", "onion powder", "coriander", "turmeric", "curry powder",
    "cinnamon", "nutmeg", "cloves", "allspice", "ginger", "mustard powder",
    "oregano", "basil", "thyme", "rosemary", "sage", "parsley",
    "dill", "bay leaves", "marjoram", "tarragon", "fennel", "cardamom",
    "caraway", "anise", "fenugreek", "sumac", "vanilla", "saffron",
    "star anise", "juniper berries", "lavender", "lemon zest", "orange zest",
    "chives", "cilantro", "mint", "cumin seeds", "mustard seeds", "poppy seeds",
    "sesame seeds", "sunflower seeds", "pumpkin seeds", "flaxseeds", "chia seeds"
];

export const IngredientBank = {
    meat: meatIngredients,
    seafood: seaFoodIngredients,
    vegetable: vegetableIngredients,
    dairy: dairyIngredients,
    sauce: sauceIngredients,
    grain: grainIngredients,
    fruit: fruitIngredients,
    nut: nutIngredients,
    egg: eggIngredients,
}