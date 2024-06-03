import { ChakraBaseProvider, extendTheme } from '@chakra-ui/react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import HomeLayout from './layouts/HomeLayout.tsx';
import { Ingredient, Login, Main, Meal, Register } from './pages/index';
import theme from './style/theme';
import IndividualMeal from './pages/Recipe.tsx';
import { Dish } from './components/meals/ImageSlide'
import PersonalDashboard from './pages/User.tsx';
import { TableData } from './pages/User.tsx';
import { BackendData, transformToDishes } from './utils/mealDataTransform.ts';
import { MealProps } from './pages/Recipe.tsx';
import ImageScan from './components/ingredients/ImageScan.tsx';

// const { Button } = chakraTheme.components;

// const theme = extendBaseTheme({
//   components: {
//     Button,
//   },
// });

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'ingredients',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Ingredient />,
          },
          {
            path: ':category',
            element: <Ingredient />,
          },
        ],
      },
      {
        path: 'meals',
        element: <Meal />,
      },
      {
        path: 'community',
        element: <div>Community</div>,
      },
    ],
  },
]);

const backendData: BackendData = {
  title: 'Sample Meal',
  imageUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800',
  allIngredients: [],
  amount: new Map(),
  tags: ['healthy', 'vegan'],
  source: 'user',
  instruction: 'Cook for 20 minutes.',
  analyzeInstruction: [
    {
      name: 'To prepare the skewers',
      steps: [
        {
          number: 1,
          step: 'Soak 8 bamboo skewers in water for at least 30 minutes. Set aside.',
          ingredients: [
            {
              id: 14412,
              name: 'water',
              localizedName: 'water',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/water.png',
            },
          ],
          equipment: [
            {
              id: 3065,
              name: 'skewers',
              localizedName: 'skewers',
              image: 'https://spoonacular.com/cdn/equipment_100x100/wooden-skewers.jpg',
            },
          ],
          length: {
            number: 30,
            unit: 'minutes',
          },
        },
      ],
    },
    {
      name: 'To make the sauce',
      steps: [
        {
          number: 1,
          step: 'Cut the top of the dried chili and shake out the seeds.',
          ingredients: [
            {
              id: 10111962,
              name: 'dried chili pepper',
              localizedName: 'dried chili pepper',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/dried-arbol-chiles.jpg',
            },
            {
              id: 93818,
              name: 'seeds',
              localizedName: 'seeds',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/sunflower-seeds.jpg',
            },
            {
              id: 0,
              name: 'shake',
              localizedName: 'shake',
              image: '',
            },
          ],
          equipment: [],
        },
        {
          number: 2,
          step: 'Transfer them into a saucepan along with the prunes, broth, tomatoes, tomato paste, onion, molasses, garlic, pumpkin seeds, cumin, and oregano. Bring the mixture to a boil over high heat and cook for 2 minutes; then lower the heat to a simmer and cook for 20 minutes more.',
          ingredients: [
            {
              id: 12014,
              name: 'pumpkin seeds',
              localizedName: 'pumpkin seeds',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/pumpkin-seeds.jpg',
            },
            {
              id: 11887,
              name: 'tomato paste',
              localizedName: 'tomato paste',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/tomato-paste.jpg',
            },
            {
              id: 19304,
              name: 'molasses',
              localizedName: 'molasses',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/molasses.jpg',
            },
            {
              id: 11529,
              name: 'tomato',
              localizedName: 'tomato',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/tomato.png',
            },
            {
              id: 2027,
              name: 'oregano',
              localizedName: 'oregano',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/oregano.jpg',
            },
            {
              id: 11215,
              name: 'garlic',
              localizedName: 'garlic',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/garlic.png',
            },
            {
              id: 9291,
              name: 'prunes',
              localizedName: 'prunes',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/prunes.jpg',
            },
            {
              id: 1006615,
              name: 'broth',
              localizedName: 'broth',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/chicken-broth.png',
            },
            {
              id: 1002014,
              name: 'cumin',
              localizedName: 'cumin',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/ground-cumin.jpg',
            },
            {
              id: 11282,
              name: 'onion',
              localizedName: 'onion',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/brown-onion.png',
            },
          ],
          equipment: [
            {
              id: 404669,
              name: 'sauce pan',
              localizedName: 'sauce pan',
              image: 'https://spoonacular.com/cdn/equipment_100x100/sauce-pan.jpg',
            },
          ],
          length: {
            number: 22,
            unit: 'minutes',
          },
        },
        {
          number: 3,
          step: 'Using an immersion blender, puree the mixture until completely smooth. Return to the heat and simmer, uncovered, for another 15 to 20 minutes. (If you dont have an immersion blender, carefully ladle the sauce into a food processor, and process until smooth, working in batches; then return to the pot.) Set the sauce aside until ready to serve with the corndogs, or if you are making this ahead of time, once the sauce has cooled, transfer it to a container and refrigerate.',
          ingredients: [
            {
              id: 0,
              name: 'sauce',
              localizedName: 'sauce',
              image: '',
            },
          ],
          equipment: [
            {
              id: 404776,
              name: 'immersion blender',
              localizedName: 'immersion blender',
              image: 'https://spoonacular.com/cdn/equipment_100x100/immersion-blender.png',
            },
            {
              id: 404771,
              name: 'food processor',
              localizedName: 'food processor',
              image: 'https://spoonacular.com/cdn/equipment_100x100/food-processor.png',
            },
            {
              id: 404630,
              name: 'ladle',
              localizedName: 'ladle',
              image: 'https://spoonacular.com/cdn/equipment_100x100/ladle.jpg',
            },
            {
              id: 404752,
              name: 'pot',
              localizedName: 'pot',
              image: 'https://spoonacular.com/cdn/equipment_100x100/stock-pot.jpg',
            },
          ],
          length: {
            number: 15,
            unit: 'minutes',
          },
        },
      ],
    },
    {
      name: 'To prepare the corn dogs',
      steps: [
        {
          number: 1,
          step: 'In a mixing bowl, combine the masa harina, cornmeal,  cup of the rice flour, baking powder, brown sugar, and salt and mix to combine.',
          ingredients: [
            {
              id: 18369,
              name: 'baking powder',
              localizedName: 'baking powder',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/white-powder.jpg',
            },
            {
              id: 19334,
              name: 'brown sugar',
              localizedName: 'brown sugar',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/dark-brown-sugar.png',
            },
            {
              id: 20317,
              name: 'masa harina',
              localizedName: 'masa harina',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/corn-flour.jpg',
            },
            {
              id: 20061,
              name: 'rice flour',
              localizedName: 'rice flour',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/white-powder.jpg',
            },
            {
              id: 35137,
              name: 'cornmeal',
              localizedName: 'cornmeal',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/cornmeal.png',
            },
            {
              id: 2047,
              name: 'salt',
              localizedName: 'salt',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/salt.jpg',
            },
          ],
          equipment: [
            {
              id: 405907,
              name: 'mixing bowl',
              localizedName: 'mixing bowl',
              image: 'https://spoonacular.com/cdn/equipment_100x100/mixing-bowl.jpg',
            },
          ],
        },
        {
          number: 2,
          step: 'Add the eggs, one at a time, mixing well to combine.',
          ingredients: [
            {
              id: 1123,
              name: 'egg',
              localizedName: 'egg',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/egg.png',
            },
          ],
          equipment: [],
        },
        {
          number: 3,
          step: 'Add the rice milk and lime juice and mix to combine. The mixture should resemble a thick pancake batter; if more milk is needed, add by the tablespoonful. Cover and refrigerate the mixture if you are not going to be frying right away.',
          ingredients: [
            {
              id: 9160,
              name: 'lime juice',
              localizedName: 'lime juice',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/lime-juice.png',
            },
            {
              id: 93761,
              name: 'rice milk',
              localizedName: 'rice milk',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/rice-milk.png',
            },
            {
              id: 1077,
              name: 'milk',
              localizedName: 'milk',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/milk.png',
            },
          ],
          equipment: [],
        },
        {
          number: 4,
          step: 'When you are ready to cook, heat the oil in a saucepan until it registers 350F on a deep-frying thermometer. While the oil is heating, place the remaining rice flour on a paper plate and set aside.',
          ingredients: [
            {
              id: 20061,
              name: 'rice flour',
              localizedName: 'rice flour',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/white-powder.jpg',
            },
            {
              id: 4582,
              name: 'cooking oil',
              localizedName: 'cooking oil',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/vegetable-oil.jpg',
            },
          ],
          equipment: [
            {
              id: 404789,
              name: 'kitchen thermometer',
              localizedName: 'kitchen thermometer',
              image: 'https://spoonacular.com/cdn/equipment_100x100/food-thermometer.jpg',
            },
            {
              id: 404669,
              name: 'sauce pan',
              localizedName: 'sauce pan',
              image: 'https://spoonacular.com/cdn/equipment_100x100/sauce-pan.jpg',
            },
          ],
        },
        {
          number: 5,
          step: 'Cut each chicken sausage in half crosswise, to make eight pieces.',
          ingredients: [
            {
              id: 93668,
              name: 'chicken sausage',
              localizedName: 'chicken sausage',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/chicken-or-turkey-sausage.jpg',
            },
          ],
          equipment: [],
        },
        {
          number: 6,
          step: 'Roll each piece of sausage in the rice flour to lightly coat. Thread the moistened bamboo skewers through the sausage pieces, so that the tips of the skewers are not quite poking out the top. Holding it by its skewer, dip a floured sausage piece into the batter, until it is completely coated. Carefully lift the stick and hold it over the bowl for a few seconds, allowing any excess batter to drip off. Repeat with another skewer. Carefully place two corn dogs into the hot oil and cook until they are crusty on the outside, and dark golden brown, 3 to 4 minutes.',
          ingredients: [
            {
              id: 20061,
              name: 'rice flour',
              localizedName: 'rice flour',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/white-powder.jpg',
            },
            {
              id: 1017063,
              name: 'sausage',
              localizedName: 'sausage',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/raw-pork-sausage.png',
            },
            {
              id: 11168,
              name: 'corn',
              localizedName: 'corn',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/corn.png',
            },
            {
              id: 21118,
              name: 'hot dogs',
              localizedName: 'hot dogs',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/hotdogs.png',
            },
            {
              id: 0,
              name: 'roll',
              localizedName: 'roll',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/dinner-yeast-rolls.jpg',
            },
            {
              id: 0,
              name: 'dip',
              localizedName: 'dip',
              image: '',
            },
            {
              id: 4582,
              name: 'cooking oil',
              localizedName: 'cooking oil',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/vegetable-oil.jpg',
            },
          ],
          equipment: [
            {
              id: 3065,
              name: 'skewers',
              localizedName: 'skewers',
              image: 'https://spoonacular.com/cdn/equipment_100x100/wooden-skewers.jpg',
            },
            {
              id: 404783,
              name: 'bowl',
              localizedName: 'bowl',
              image: 'https://spoonacular.com/cdn/equipment_100x100/bowl.jpg',
            },
          ],
          length: {
            number: 3,
            unit: 'minutes',
          },
        },
        {
          number: 7,
          step: 'Drain on paper towels and keep warm. Repeat with each skewered sausage, allowing the oil to return to 350F in between.',
          ingredients: [
            {
              id: 1017063,
              name: 'sausage',
              localizedName: 'sausage',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/raw-pork-sausage.png',
            },
            {
              id: 4582,
              name: 'cooking oil',
              localizedName: 'cooking oil',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/vegetable-oil.jpg',
            },
          ],
          equipment: [
            {
              id: 405895,
              name: 'paper towels',
              localizedName: 'paper towels',
              image: 'https://spoonacular.com/cdn/equipment_100x100/paper-towels.jpg',
            },
          ],
        },
        {
          number: 8,
          step: 'Serve immediately with the chili.',
          ingredients: [
            {
              id: 11819,
              name: 'chili pepper',
              localizedName: 'chili pepper',
              image: 'https://spoonacular.com/cdn/ingredients_100x100/red-chili.jpg',
            },
          ],
          equipment: [],
        },
      ],
    },
  ],
  id: '1',
  videoLink: 'https://example.com/video',
  description: 'This is a sample meal.',
  price: '18',
  readyInMinutes: '45',
  servings: 2,
  dishTypes: ['main course'],
  taste: {
    sweetness: 5,
    saltiness: 5,
    sourness: 5,
    bitterness: 5,
    savoriness: 5,
    fattiness: 5,
    spiciness: 5,
  },
};

const individualMeal: Dish[] = transformToDishes(backendData.analyzeInstruction);

const PersonalDashboardWrapper = () => {
  const userInfo = {
    avatar: {
      src: "../public/images/1989-Taylors-Version.webp",
      username: "Taylor Swift",
    },
    email: "taylorswift@gmail.com",
    phone: "+1 (202) 444 1989",
    address: {
      city: "Nashville",
      state: "Tennessee",
      country: "USA",
      zipcode: "37208",
    },
  };

  const Dailydata = [
    {
      mealType: 'Breakfast',
      calories: 120.4,
      carbs: 53.7,
      protein: 62.4,
      fat: 14.5,
    },
    {
      mealType: 'Lunch',
      calories: 280.6,
      carbs: 130.7,
      protein: 136.2,
      fat: 18.4,
    },
    {
      mealType: 'Dinner',
      calories: 220.7,
      carbs: 89.4,
      protein: 100.9,
      fat: 19.8,
    }
  ];

  const recentMeals = [
    {
      image: 'https://www.chilipeppermadness.com/wp-content/uploads/2023/12/Bun-Bo-Hue-Recipe1.jpg',
      title: 'Bun bo Hue',
      calories: 550,
      date: '04/28/2024',
      infoLink: 'https://www.chilipeppermadness.com/recipes/bun-bo-hue/',
    },
    {
      image:
        'https://assets.bonappetit.com/photos/6437281f4c497b684ece7ff3/1:1/w_2240,c_limit/Recipe_Beauty_Gingery_Chicken_Ramen_0350.jpg',
      title: 'Ramen',
      calories: 400,
      date: '04/22/2024',
      infoLink: 'https://www.bonappetit.com/recipe/homemade-chicken-ramen-recipe',
    },
    {
      image: 'https://joyfoodsunshine.com/wp-content/uploads/2022/11/BBQ-chicken-pizza-recipe-8.jpg',
      title: 'Pizza',
      calories: 780,
      date: '04/18/2024',
      infoLink: 'https://joyfoodsunshine.com/bbq-chicken-pizza/',
    },
    {
      image: 'https://www.budgetbytes.com/wp-content/uploads/2013/07/Creamy-Tomato-Spinach-Pasta-V2-bowl.jpg',
      title: 'Pasta',
      calories: 600,
      date: '04/15/2024',
      infoLink: 'https://www.budgetbytes.com/wp-content/uploads/2013/07/Creamy-Tomato-Spinach-Pasta-V2-bowl.jpg',
    },
    {
      image: 'https://preppykitchen.com/wp-content/uploads/2022/05/Naked-Cake-Blog2.jpg',
      title: 'Naked Cake',
      calories: 600,
      date: '04/12/2024',
      infoLink: 'https://preppykitchen.com/wp-content/uploads/2022/05/Naked-Cake-Blog2.jpg',
    },
    {
      image:
        'https://img.taste.com.au/4F5Z2H_-/w720-h480-cfill-q80/taste/2016/11/aussie-style-beef-and-salad-tacos-86525-1.jpeg',
      title: 'Tacos',
      calories: 600,
      date: '03/28/2024',
      infoLink:
        'https://img.taste.com.au/4F5Z2H_-/w720-h480-cfill-q80/taste/2016/11/aussie-style-beef-and-salad-tacos-86525-1.jpeg',
    },
    {
      image: 'https://www.chilipeppermadness.com/wp-content/uploads/2023/12/Bun-Bo-Hue-Recipe1.jpg',
      title: 'Bun bo Hue',
      calories: 550,
      date: '04/28/2024',
      infoLink: 'https://www.chilipeppermadness.com/recipes/bun-bo-hue/',
    },
    {
      image:
        'https://assets.bonappetit.com/photos/6437281f4c497b684ece7ff3/1:1/w_2240,c_limit/Recipe_Beauty_Gingery_Chicken_Ramen_0350.jpg',
      title: 'Ramen',
      calories: 400,
      date: '04/22/2024',
      infoLink: 'https://www.bonappetit.com/recipe/homemade-chicken-ramen-recipe',
    },
  ];

  const weeklyData = {
    weeklyProtein: 70, 
    weeklyCarb: 50, 
    weeklyFat: 30, 
  };

  const weeklyCalories = [
    { date: 'Mon', weeklyCalories: '200' },
    { date: 'Tue', weeklyCalories: '250' },
    { date: 'Wed', weeklyCalories: '300' },
    { date: 'Thu', weeklyCalories: '280' },
    { date: 'Fri', weeklyCalories: '350' },
    { date: 'Sat', weeklyCalories: '400' },
    { date: 'Sun', weeklyCalories: '370' },
  ];

  const dashboardProps = {
    mealData: Dailydata,
    info: userInfo,
    totalMeals: '12',
    points: '34',
    tags: 'diet',
    reviewsGiven: '10',
    recipesShared: '8',
    caloriesConsumed: '5420',
    badgesEarned: 'First popular shared',
    recentMeals: recentMeals,
    protein: '210',
    vitamins: '48',
    carb: '190',
    fat: '120',
    minerals: '42',
    weeklySummaryData: weeklyData,
    weeklyCaloriesData: weeklyCalories
  }
  return <PersonalDashboard {...dashboardProps}/>;
};


function App() {
  return (
    <ChakraBaseProvider theme={extendTheme(theme)}>
      {/* <IndividualMeal
        individualMeal={individualMeal}
        title={backendData.title}
        overview={backendData.instruction}
        image={backendData.imageUrl}
        totalTime="45 minutes"
        servings="4 servings"
        calories="450 kcal"
        averageStar="4.8"
        numReviews="10"
      /> */}
      {/* <ImageScan /> */}
      <PersonalDashboardWrapper/>
      {/* <RouterProvider router={router} /> */}
      <ToastContainer autoClose={5000} limit={3} transition={Slide} />
    </ChakraBaseProvider>
  );
}
export default App;
