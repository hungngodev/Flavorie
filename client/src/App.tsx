import { Dish } from './components/meals/ImageSlide';
import { ChakraBaseProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import HomeLayout from './layouts/HomeLayout';
import {loader as ingredientsLoader } from './pages/Ingredient.tsx';
import { loader as mealsLoader } from './pages/Meal.tsx';
import NotificationDetailPage from './pages/NotificationDetail.tsx';
import NotificationPage from './pages/NotificationPage.tsx';
import ReceiptScan from './pages/ReceiptScan.tsx';
import { loader as recipeLoader } from './pages/Recipe.tsx';
import { Ingredient, Login, Main, Meal, Recipe, Register, User } from './pages/index';
import ToastProvider from './providers/ToastProvider.tsx';
import theme from './style/theme';
import IndividualMeal from './pages/Recipe';
import { BackendData, transformToDishes } from './utils/mealDataTransform';
import NutritionCard from './components/ingredients/NutritionCard';
import { IngredientProps } from './components/ingredients/NutritionCard';
import Receipt from './pages/Receipt.tsx';

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
      {
        path: 'ingredients',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <div>HIHIH</div>,
          },
          {
            path: ':category',
            element: <Ingredient />,
            loader: ingredientsLoader(queryClient),
          },
        ],
      },
      {
        path: 'meals',
        children: [
          {
            index: true,
            element: <Meal />,
            loader: mealsLoader(queryClient),
          },
          {
            path: ':mealId',
            element: <Recipe />,
            loader: recipeLoader(queryClient),
          },
        ],
      },
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
        path: 'upload-receipts',
        element: <ReceiptScan />,
      },
      {
        path: 'notifications',
        element: <NotificationPage />,
      },
      {
        path: 'receipts/:id',
        element: <Receipt />,
      },
      // {
      //   path: 'notifications/:id',
      //   element: <NotificationDetailPage />
      // }
      // {
      //   path: 'receipts-test',
      //   element: <Receipt />
      // }
    ],
  },
]);


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
      <ToastProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ToastContainer autoClose={5000} limit={3} transition={Slide} />
            <ReactQueryDevtools />
          </QueryClientProvider>
      </ToastProvider>
      {/* <IndividualMealWrapper /> */}
      {/* <ImageScan /> */}
    </ChakraBaseProvider>
  );
}
export default App;

