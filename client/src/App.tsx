import { ChakraBaseProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import { IngredientProps } from './components/ingredients/NutritionCard';
import HomeLayout from './layouts/HomeLayout';
import { loader as FeedLoader } from './pages/Feed';
import { Feed, Login, Main, Register, User } from './pages/index';
import theme from './style/theme';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

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
      // {
      //   path: 'ingredients',
      //   element: <Outlet />,
      //   children: [
      //     {
      //       index: true,
      //       element: <div>HIHIH</div>,
      //     },
      //     {
      //       path: ':category',
      //       element: <Ingredient />,
      //       loader: ingredientsLoader(queryClient),
      //     },
      //   ],
      // },
      // {
      //   path: 'meals',
      //   children: [
      //     {
      //       index: true,
      //       element: <Meal />,
      //       loader: mealsLoader(queryClient),
      //     },
      //     {
      //       path: ':mealId',
      //       element: <Recipe />,
      //       loader: recipeLoader(queryClient),
      //     },
      //   ],
      // },
      {
        path: 'community',
        children: [
          {
            index: true,
            element: <div>Community</div>,
          },
        ],
      },
      {
        path: 'profile',
        element: <User />,
      },
      {
        path: 'feed',
        element: <Feed />,
        loader: FeedLoader(queryClient),
      },
    ],
  },
]);

// const backendData: BackendData = {
//   title: 'Sample Meal',
//   imageUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800',
//   allIngredients: [],
//   amount: new Map(),
//   tags: ['Healthy', 'Vegan'],
//   source: 'spoonacular',
//   instruction: 'Cook for 20 minutes.',
//   analyzeInstruction: [
//     {
//       name: 'To prepare the skewers',
//       steps: [
//         {
//           number: 1,
//           step: 'Soak 8 bamboo skewers in water for at least 30 minutes. Set aside.',
//           ingredients: [
//             {
//               id: 14412,
//               name: 'water',
//               localizedName: 'water',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/water.png',
//             },
//           ],
//           equipment: [
//             {
//               id: 3065,
//               name: 'skewers',
//               localizedName: 'skewers',
//               image: 'https://spoonacular.com/cdn/equipment_100x100/wooden-skewers.jpg',
//             },
//           ],
//           length: {
//             number: 30,
//             unit: 'minutes',
//           },
//         },
//       ],
//     },
//     {
//       name: 'To make the sauce',
//       steps: [
//         {
//           number: 1,
//           step: 'Cut the top of the dried chili and shake out the seeds.',
//           ingredients: [
//             {
//               id: 10111962,
//               name: 'dried chili pepper',
//               localizedName: 'dried chili pepper',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/dried-arbol-chiles.jpg',
//             },
//             {
//               id: 93818,
//               name: 'seeds',
//               localizedName: 'seeds',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/sunflower-seeds.jpg',
//             },
//             {
//               id: 0,
//               name: 'shake',
//               localizedName: 'shake',
//               image: '',
//             },
//           ],
//           equipment: [],
//         },
//         {
//           number: 2,
//           step: 'Transfer them into a saucepan along with the prunes, broth, tomatoes, tomato paste, onion, molasses, garlic, pumpkin seeds, cumin, and oregano. Bring the mixture to a boil over high heat and cook for 2 minutes; then lower the heat to a simmer and cook for 20 minutes more.',
//           ingredients: [
//             {
//               id: 12014,
//               name: 'pumpkin seeds',
//               localizedName: 'pumpkin seeds',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/pumpkin-seeds.jpg',
//             },
//             {
//               id: 11887,
//               name: 'tomato paste',
//               localizedName: 'tomato paste',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/tomato-paste.jpg',
//             },
//             {
//               id: 19304,
//               name: 'molasses',
//               localizedName: 'molasses',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/molasses.jpg',
//             },
//             {
//               id: 11529,
//               name: 'tomato',
//               localizedName: 'tomato',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/tomato.png',
//             },
//             {
//               id: 2027,
//               name: 'oregano',
//               localizedName: 'oregano',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/oregano.jpg',
//             },
//             {
//               id: 11215,
//               name: 'garlic',
//               localizedName: 'garlic',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/garlic.png',
//             },
//             {
//               id: 9291,
//               name: 'prunes',
//               localizedName: 'prunes',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/prunes.jpg',
//             },
//             {
//               id: 1006615,
//               name: 'broth',
//               localizedName: 'broth',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/chicken-broth.png',
//             },
//             {
//               id: 1002014,
//               name: 'cumin',
//               localizedName: 'cumin',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/ground-cumin.jpg',
//             },
//             {
//               id: 11282,
//               name: 'onion',
//               localizedName: 'onion',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/brown-onion.png',
//             },
//           ],
//           equipment: [
//             {
//               id: 404669,
//               name: 'sauce pan',
//               localizedName: 'sauce pan',
//               image: 'https://spoonacular.com/cdn/equipment_100x100/sauce-pan.jpg',
//             },
//           ],
//           length: {
//             number: 22,
//             unit: 'minutes',
//           },
//         },
//         {
//           number: 3,
//           step: 'Using an immersion blender, puree the mixture until completely smooth. Return to the heat and simmer, uncovered, for another 15 to 20 minutes. (If you dont have an immersion blender, carefully ladle the sauce into a food processor, and process until smooth, working in batches; then return to the pot.) Set the sauce aside until ready to serve with the corndogs, or if you are making this ahead of time, once the sauce has cooled, transfer it to a container and refrigerate.',
//           ingredients: [
//             {
//               id: 0,
//               name: 'sauce',
//               localizedName: 'sauce',
//               image: '',
//             },
//           ],
//           equipment: [
//             {
//               id: 404776,
//               name: 'immersion blender',
//               localizedName: 'immersion blender',
//               image: 'https://spoonacular.com/cdn/equipment_100x100/immersion-blender.png',
//             },
//             {
//               id: 404771,
//               name: 'food processor',
//               localizedName: 'food processor',
//               image: 'https://spoonacular.com/cdn/equipment_100x100/food-processor.png',
//             },
//             {
//               id: 404630,
//               name: 'ladle',
//               localizedName: 'ladle',
//               image: 'https://spoonacular.com/cdn/equipment_100x100/ladle.jpg',
//             },
//             {
//               id: 404752,
//               name: 'pot',
//               localizedName: 'pot',
//               image: 'https://spoonacular.com/cdn/equipment_100x100/stock-pot.jpg',
//             },
//           ],
//           length: {
//             number: 15,
//             unit: 'minutes',
//           },
//         },
//       ],
//     },
//     {
//       name: 'To prepare the corn dogs',
//       steps: [
//         {
//           number: 1,
//           step: 'In a mixing bowl, combine the masa harina, cornmeal,  cup of the rice flour, baking powder, brown sugar, and salt and mix to combine.',
//           ingredients: [
//             {
//               id: 18369,
//               name: 'baking powder',
//               localizedName: 'baking powder',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/white-powder.jpg',
//             },
//             {
//               id: 19334,
//               name: 'brown sugar',
//               localizedName: 'brown sugar',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/dark-brown-sugar.png',
//             },
//             {
//               id: 20317,
//               name: 'masa harina',
//               localizedName: 'masa harina',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/corn-flour.jpg',
//             },
//             {
//               id: 20061,
//               name: 'rice flour',
//               localizedName: 'rice flour',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/white-powder.jpg',
//             },
//             {
//               id: 35137,
//               name: 'cornmeal',
//               localizedName: 'cornmeal',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/cornmeal.png',
//             },
//             {
//               id: 2047,
//               name: 'salt',
//               localizedName: 'salt',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/salt.jpg',
//             },
//           ],
//           equipment: [
//             {
//               id: 405907,
//               name: 'mixing bowl',
//               localizedName: 'mixing bowl',
//               image: 'https://spoonacular.com/cdn/equipment_100x100/mixing-bowl.jpg',
//             },
//           ],
//         },
//         {
//           number: 2,
//           step: 'Add the eggs, one at a time, mixing well to combine.',
//           ingredients: [
//             {
//               id: 1123,
//               name: 'egg',
//               localizedName: 'egg',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/egg.png',
//             },
//           ],
//           equipment: [],
//         },
//         {
//           number: 3,
//           step: 'Add the rice milk and lime juice and mix to combine. The mixture should resemble a thick pancake batter; if more milk is needed, add by the tablespoonful. Cover and refrigerate the mixture if you are not going to be frying right away.',
//           ingredients: [
//             {
//               id: 9160,
//               name: 'lime juice',
//               localizedName: 'lime juice',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/lime-juice.png',
//             },
//             {
//               id: 93761,
//               name: 'rice milk',
//               localizedName: 'rice milk',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/rice-milk.png',
//             },
//             {
//               id: 1077,
//               name: 'milk',
//               localizedName: 'milk',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/milk.png',
//             },
//           ],
//           equipment: [],
//         },
//         {
//           number: 4,
//           step: 'When you are ready to cook, heat the oil in a saucepan until it registers 350F on a deep-frying thermometer. While the oil is heating, place the remaining rice flour on a paper plate and set aside.',
//           ingredients: [
//             {
//               id: 20061,
//               name: 'rice flour',
//               localizedName: 'rice flour',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/white-powder.jpg',
//             },
//             {
//               id: 4582,
//               name: 'cooking oil',
//               localizedName: 'cooking oil',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/vegetable-oil.jpg',
//             },
//           ],
//           equipment: [
//             {
//               id: 404789,
//               name: 'kitchen thermometer',
//               localizedName: 'kitchen thermometer',
//               image: 'https://spoonacular.com/cdn/equipment_100x100/food-thermometer.jpg',
//             },
//             {
//               id: 404669,
//               name: 'sauce pan',
//               localizedName: 'sauce pan',
//               image: 'https://spoonacular.com/cdn/equipment_100x100/sauce-pan.jpg',
//             },
//           ],
//         },
//         {
//           number: 5,
//           step: 'Cut each chicken sausage in half crosswise, to make eight pieces.',
//           ingredients: [
//             {
//               id: 93668,
//               name: 'chicken sausage',
//               localizedName: 'chicken sausage',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/chicken-or-turkey-sausage.jpg',
//             },
//           ],
//           equipment: [],
//         },
//         {
//           number: 6,
//           step: 'Roll each piece of sausage in the rice flour to lightly coat. Thread the moistened bamboo skewers through the sausage pieces, so that the tips of the skewers are not quite poking out the top. Holding it by its skewer, dip a floured sausage piece into the batter, until it is completely coated. Carefully lift the stick and hold it over the bowl for a few seconds, allowing any excess batter to drip off. Repeat with another skewer. Carefully place two corn dogs into the hot oil and cook until they are crusty on the outside, and dark golden brown, 3 to 4 minutes.',
//           ingredients: [
//             {
//               id: 20061,
//               name: 'rice flour',
//               localizedName: 'rice flour',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/white-powder.jpg',
//             },
//             {
//               id: 1017063,
//               name: 'sausage',
//               localizedName: 'sausage',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/raw-pork-sausage.png',
//             },
//             {
//               id: 11168,
//               name: 'corn',
//               localizedName: 'corn',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/corn.png',
//             },
//             {
//               id: 21118,
//               name: 'hot dogs',
//               localizedName: 'hot dogs',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/hotdogs.png',
//             },
//             {
//               id: 0,
//               name: 'roll',
//               localizedName: 'roll',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/dinner-yeast-rolls.jpg',
//             },
//             {
//               id: 0,
//               name: 'dip',
//               localizedName: 'dip',
//               image: '',
//             },
//             {
//               id: 4582,
//               name: 'cooking oil',
//               localizedName: 'cooking oil',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/vegetable-oil.jpg',
//             },
//           ],
//           equipment: [
//             {
//               id: 3065,
//               name: 'skewers',
//               localizedName: 'skewers',
//               image: 'https://spoonacular.com/cdn/equipment_100x100/wooden-skewers.jpg',
//             },
//             {
//               id: 404783,
//               name: 'bowl',
//               localizedName: 'bowl',
//               image: 'https://spoonacular.com/cdn/equipment_100x100/bowl.jpg',
//             },
//           ],
//           length: {
//             number: 3,
//             unit: 'minutes',
//           },
//         },
//         {
//           number: 7,
//           step: 'Drain on paper towels and keep warm. Repeat with each skewered sausage, allowing the oil to return to 350F in between.',
//           ingredients: [
//             {
//               id: 1017063,
//               name: 'sausage',
//               localizedName: 'sausage',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/raw-pork-sausage.png',
//             },
//             {
//               id: 4582,
//               name: 'cooking oil',
//               localizedName: 'cooking oil',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/vegetable-oil.jpg',
//             },
//           ],
//           equipment: [
//             {
//               id: 405895,
//               name: 'paper towels',
//               localizedName: 'paper towels',
//               image: 'https://spoonacular.com/cdn/equipment_100x100/paper-towels.jpg',
//             },
//           ],
//         },
//         {
//           number: 8,
//           step: 'Serve immediately with the chili.',
//           ingredients: [
//             {
//               id: 11819,
//               name: 'chili pepper',
//               localizedName: 'chili pepper',
//               image: 'https://spoonacular.com/cdn/ingredients_100x100/red-chili.jpg',
//             },
//           ],
//           equipment: [],
//         },
//       ],
//     },
//   ],
//   id: '1',
//   videoLink: 'https://example.com/video',
//   description: 'This is a sample meal.',
//   price: '18',
//   readyInMinutes: '45',
//   servings: 2,
//   dishTypes: ['main course'],
//   taste: {
//     sweetness: 5,
//     saltiness: 5,
//     sourness: 5,
//     bitterness: 5,
//     savoriness: 5,
//     fattiness: 5,
//     spiciness: 5,
//   },
// };

const mockdata: IngredientProps = {
  _id: {
    $oid: '662309dd71897b184e6b9843',
  },
  id: 23572,
  myCategory: 'meat',
  original: 'beef',
  originalName: 'beef',
  name: 'beef',
  amount: 100,
  unit: 'grams',
  unitShort: 'g',
  unitLong: 'grams',
  possibleUnits: ['g', 'oz', 'cup', 'serving'],
  estimatedCost: {
    value: 77.56,
    unit: 'US Cents',
  },
  consistency: 'solid',
  shoppingListUnits: ['ounces', 'pounds'],
  aisle: 'Frozen;Meat',
  image: 'beef-cubes-raw.png',
  nutrition: {
    nutrients: [
      {
        name: 'Manganese',
        amount: 0.01,
        unit: 'mg',
        percentOfDailyNeeds: 0.5,
        _id: {
          $oid: '662309dd71897b184e6b9844',
        },
      },
      {
        name: 'Calories',
        amount: 254,
        unit: 'kcal',
        percentOfDailyNeeds: 12.7,
        _id: {
          $oid: '662309dd71897b184e6b9845',
        },
      },
      {
        name: 'Copper',
        amount: 0.06,
        unit: 'mg',
        percentOfDailyNeeds: 3.05,
        _id: {
          $oid: '662309dd71897b184e6b9846',
        },
      },
      {
        name: 'Saturated Fat',
        amount: 7.67,
        unit: 'g',
        percentOfDailyNeeds: 47.96,
        _id: {
          $oid: '662309dd71897b184e6b9847',
        },
      },
      {
        name: 'Magnesium',
        amount: 17,
        unit: 'mg',
        percentOfDailyNeeds: 4.25,
        _id: {
          $oid: '662309dd71897b184e6b9848',
        },
      },
      {
        name: 'Vitamin B2',
        amount: 0.15,
        unit: 'mg',
        percentOfDailyNeeds: 8.71,
        _id: {
          $oid: '662309dd71897b184e6b9849',
        },
      },
      {
        name: 'Sugar',
        amount: 0,
        unit: 'g',
        percentOfDailyNeeds: 0,
        _id: {
          $oid: '662309dd71897b184e6b984a',
        },
      },
      {
        name: 'Vitamin E',
        amount: 0.41,
        unit: 'mg',
        percentOfDailyNeeds: 2.73,
        _id: {
          $oid: '662309dd71897b184e6b984b',
        },
      },
      {
        name: 'Sodium',
        amount: 67,
        unit: 'mg',
        percentOfDailyNeeds: 2.91,
        _id: {
          $oid: '662309dd71897b184e6b984c',
        },
      },
      {
        name: 'Mono Unsaturated Fat',
        amount: 8.76,
        unit: 'g',
        percentOfDailyNeeds: 0,
        _id: {
          $oid: '662309dd71897b184e6b984d',
        },
      },
      {
        name: 'Vitamin B3',
        amount: 4.23,
        unit: 'mg',
        percentOfDailyNeeds: 21.14,
        _id: {
          $oid: '662309dd71897b184e6b984e',
        },
      },
      {
        name: 'Lycopene',
        amount: 0,
        unit: 'µg',
        percentOfDailyNeeds: 0,
        _id: {
          $oid: '662309dd71897b184e6b984f',
        },
      },
      {
        name: 'Vitamin D',
        amount: 0.1,
        unit: 'µg',
        percentOfDailyNeeds: 0.67,
        _id: {
          $oid: '662309dd71897b184e6b9850',
        },
      },
      {
        name: 'Trans Fat',
        amount: 1.23,
        unit: 'g',
        percentOfDailyNeeds: 12320,
        _id: {
          $oid: '662309dd71897b184e6b9851',
        },
      },
      {
        name: 'Vitamin B1',
        amount: 0.04,
        unit: 'mg',
        percentOfDailyNeeds: 2.87,
        _id: {
          $oid: '662309dd71897b184e6b9852',
        },
      },
      {
        name: 'Cholesterol',
        amount: 71,
        unit: 'mg',
        percentOfDailyNeeds: 23.67,
        _id: {
          $oid: '662309dd71897b184e6b9853',
        },
      },
      {
        name: 'Vitamin B6',
        amount: 0.32,
        unit: 'mg',
        percentOfDailyNeeds: 16.15,
        _id: {
          $oid: '662309dd71897b184e6b9854',
        },
      },
      {
        name: 'Phosphorus',
        amount: 158,
        unit: 'mg',
        percentOfDailyNeeds: 15.8,
        _id: {
          $oid: '662309dd71897b184e6b9855',
        },
      },
      {
        name: 'Selenium',
        amount: 15,
        unit: 'µg',
        percentOfDailyNeeds: 21.43,
        _id: {
          $oid: '662309dd71897b184e6b9856',
        },
      },
      {
        name: 'Folic Acid',
        amount: 0,
        unit: 'µg',
        percentOfDailyNeeds: 0,
        _id: {
          $oid: '662309dd71897b184e6b9857',
        },
      },
      {
        name: 'Carbohydrates',
        amount: 0,
        unit: 'g',
        percentOfDailyNeeds: 0,
        _id: {
          $oid: '662309dd71897b184e6b9858',
        },
      },
      {
        name: 'Poly Unsaturated Fat',
        amount: 0.52,
        unit: 'g',
        percentOfDailyNeeds: 0,
        _id: {
          $oid: '662309dd71897b184e6b9859',
        },
      },
      {
        name: 'Vitamin K',
        amount: 1.8,
        unit: 'µg',
        percentOfDailyNeeds: 1.71,
        _id: {
          $oid: '662309dd71897b184e6b985a',
        },
      },
      {
        name: 'Iron',
        amount: 1.94,
        unit: 'mg',
        percentOfDailyNeeds: 10.78,
        _id: {
          $oid: '662309dd71897b184e6b985b',
        },
      },
      {
        name: 'Choline',
        amount: 56.4,
        unit: 'mg',
        percentOfDailyNeeds: 0,
        _id: {
          $oid: '662309dd71897b184e6b985c',
        },
      },
      {
        name: 'Fiber',
        amount: 0,
        unit: 'g',
        percentOfDailyNeeds: 0,
        _id: {
          $oid: '662309dd71897b184e6b985d',
        },
      },
      {
        name: 'Protein',
        amount: 17.17,
        unit: 'g',
        percentOfDailyNeeds: 34.34,
        _id: {
          $oid: '662309dd71897b184e6b985e',
        },
      },
      {
        name: 'Calcium',
        amount: 18,
        unit: 'mg',
        percentOfDailyNeeds: 1.8,
        _id: {
          $oid: '662309dd71897b184e6b985f',
        },
      },
      {
        name: 'Vitamin A',
        amount: 0,
        unit: 'IU',
        percentOfDailyNeeds: 0,
        _id: {
          $oid: '662309dd71897b184e6b9860',
        },
      },
      {
        name: 'Vitamin B12',
        amount: 2.14,
        unit: 'µg',
        percentOfDailyNeeds: 35.67,
        _id: {
          $oid: '662309dd71897b184e6b9861',
        },
      },
      {
        name: 'Fat',
        amount: 20,
        unit: 'g',
        percentOfDailyNeeds: 30.77,
        _id: {
          $oid: '662309dd71897b184e6b9862',
        },
      },
      {
        name: 'Caffeine',
        amount: 0,
        unit: 'mg',
        percentOfDailyNeeds: 0,
        _id: {
          $oid: '662309dd71897b184e6b9863',
        },
      },
      {
        name: 'Folate',
        amount: 7,
        unit: 'µg',
        percentOfDailyNeeds: 1.75,
        _id: {
          $oid: '662309dd71897b184e6b9864',
        },
      },
      {
        name: 'Net Carbohydrates',
        amount: 0,
        unit: 'g',
        percentOfDailyNeeds: 0,
        _id: {
          $oid: '662309dd71897b184e6b9865',
        },
      },
      {
        name: 'Alcohol',
        amount: 0,
        unit: 'g',
        percentOfDailyNeeds: 0,
        _id: {
          $oid: '662309dd71897b184e6b9866',
        },
      },
      {
        name: 'Potassium',
        amount: 270,
        unit: 'mg',
        percentOfDailyNeeds: 7.71,
        _id: {
          $oid: '662309dd71897b184e6b9867',
        },
      },
      {
        name: 'Vitamin C',
        amount: 0,
        unit: 'mg',
        percentOfDailyNeeds: 0,
        _id: {
          $oid: '662309dd71897b184e6b9868',
        },
      },
      {
        name: 'Fluoride',
        amount: 22.4,
        unit: 'mg',
        percentOfDailyNeeds: 0,
        _id: {
          $oid: '662309dd71897b184e6b9869',
        },
      },
      {
        name: 'Vitamin B5',
        amount: 0.5,
        unit: 'mg',
        percentOfDailyNeeds: 5.02,
        _id: {
          $oid: '662309dd71897b184e6b986a',
        },
      },
      {
        name: 'Zinc',
        amount: 4.18,
        unit: 'mg',
        percentOfDailyNeeds: 27.87,
        _id: {
          $oid: '662309dd71897b184e6b986b',
        },
      },
    ],
    caloricBreakdown: {
      percentProtein: 27.62,
      percentFat: 72.38,
      percentCarbs: 0,
    },
    weightPerServing: {
      amount: 100,
      unit: 'g',
    },
  },
  categoryPath: ['red meat', 'meat'],
};

function App() {
  return (
    <ChakraBaseProvider theme={extendTheme(theme)}>
      <QueryClientProvider client={queryClient}>
        {/* <ImageScan /> */}
        <RouterProvider router={router} />
        {/* <IndividualMeal
          recipeData={backendData}
          calories='340 kcal'
          averageStar="4.5"
          numReviews="3"
        /> */}
        {/* <NutritionCard {...mockdata} /> */}
        <ToastContainer autoClose={5000} limit={3} transition={Slide} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ChakraBaseProvider>
  );
}
export default App;
