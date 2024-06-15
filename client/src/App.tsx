import React from 'react';
import { ChakraBaseProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import HomeLayout from './layouts/HomeLayout.tsx';
import { loader as ingredientsLoader } from './pages/Ingredient.tsx';
import { loader as mealsLoader } from './pages/Meal.tsx';
import { loader as recipeLoader } from './pages/Recipe.tsx';
import { Ingredient, Login, Main, Meal, Recipe, Register, User } from './pages/index';
import theme from './style/theme';
import IndividualMeal from './pages/Recipe';
// import User from './pages/User';
import { TableData } from './pages/User';
import { BackendData, transformToDishes } from './utils/mealDataTransform';
import { MealProps } from './pages/Recipe';
import ImageScan from './components/ingredients/ImageScan';
import NutritionCard from './components/ingredients/NutritionCard';
import { IngredientProps } from './components/ingredients/NutritionCard';

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
    ],
  },
]);


// const PersonalDashboardWrapper = () => {
//   const userInfo = {
//     avatar: {
//       src: "../public/images/1989-Taylors-Version.webp",
//       username: "Alex B",
//     },
//     email: "taylorswift@gmail.com",
//     phone: "+1 (202) 444 1989",
//     address: {
//       city: "Nashville",
//       state: "Tennessee",
//       country: "USA",
//       zipcode: "37208",
//     },
//   };

//   const Dailydata = [
//     {
//       mealType: 'Breakfast',
//       calories: 120.4,
//       carbs: 53.7,
//       protein: 62.4,
//       fat: 14.5,
//     },
//     {
//       mealType: 'Lunch',
//       calories: 280.6,
//       carbs: 130.7,
//       protein: 136.2,
//       fat: 18.4,
//     },
//     {
//       mealType: 'Dinner',
//       calories: 220.7,
//       carbs: 89.4,
//       protein: 100.9,
//       fat: 19.8,
//     }
//   ];

//   const recentMeals = [
//     {
//       image: 'https://www.chilipeppermadness.com/wp-content/uploads/2023/12/Bun-Bo-Hue-Recipe1.jpg',
//       title: 'Bun bo Hue',
//       calories: 550,
//       date: '04/28/2024',
//       infoLink: 'https://www.chilipeppermadness.com/recipes/bun-bo-hue/',
//     },
//     {
//       image:
//         'https://assets.bonappetit.com/photos/6437281f4c497b684ece7ff3/1:1/w_2240,c_limit/Recipe_Beauty_Gingery_Chicken_Ramen_0350.jpg',
//       title: 'Ramen',
//       calories: 400,
//       date: '04/22/2024',
//       infoLink: 'https://www.bonappetit.com/recipe/homemade-chicken-ramen-recipe',
//     },
//     {
//       image: 'https://joyfoodsunshine.com/wp-content/uploads/2022/11/BBQ-chicken-pizza-recipe-8.jpg',
//       title: 'Pizza',
//       calories: 780,
//       date: '04/18/2024',
//       infoLink: 'https://joyfoodsunshine.com/bbq-chicken-pizza/',
//     },
//     {
//       image: 'https://www.budgetbytes.com/wp-content/uploads/2013/07/Creamy-Tomato-Spinach-Pasta-V2-bowl.jpg',
//       title: 'Pasta',
//       calories: 600,
//       date: '04/15/2024',
//       infoLink: 'https://www.budgetbytes.com/wp-content/uploads/2013/07/Creamy-Tomato-Spinach-Pasta-V2-bowl.jpg',
//     },
//     {
//       image: 'https://preppykitchen.com/wp-content/uploads/2022/05/Naked-Cake-Blog2.jpg',
//       title: 'Naked Cake',
//       calories: 600,
//       date: '04/12/2024',
//       infoLink: 'https://preppykitchen.com/wp-content/uploads/2022/05/Naked-Cake-Blog2.jpg',
//     },
//     {
//       image:
//         'https://img.taste.com.au/4F5Z2H_-/w720-h480-cfill-q80/taste/2016/11/aussie-style-beef-and-salad-tacos-86525-1.jpeg',
//       title: 'Tacos',
//       calories: 600,
//       date: '03/28/2024',
//       infoLink:
//         'https://img.taste.com.au/4F5Z2H_-/w720-h480-cfill-q80/taste/2016/11/aussie-style-beef-and-salad-tacos-86525-1.jpeg',
//     },
//     {
//       image: 'https://www.chilipeppermadness.com/wp-content/uploads/2023/12/Bun-Bo-Hue-Recipe1.jpg',
//       title: 'Bun bo Hue',
//       calories: 550,
//       date: '04/28/2024',
//       infoLink: 'https://www.chilipeppermadness.com/recipes/bun-bo-hue/',
//     },
//     {
//       image:
//         'https://assets.bonappetit.com/photos/6437281f4c497b684ece7ff3/1:1/w_2240,c_limit/Recipe_Beauty_Gingery_Chicken_Ramen_0350.jpg',
//       title: 'Ramen',
//       calories: 400,
//       date: '04/22/2024',
//       infoLink: 'https://www.bonappetit.com/recipe/homemade-chicken-ramen-recipe',
//     },
//   ];

//   return (
//     <IndividualMeal
//       individualMeal={sampleMeal}
//       title="Sample Meal Title"
//       overview="This is an overview of the sample meal."
//       totalTime="45 mins"
//       servings="4"
//       calories="500"
//       averageStar='5'
//       numReviews='1'
//     />
//   );
// };

function App() {
  return (
    <ChakraBaseProvider theme={extendTheme(theme)}>
      <QueryClientProvider client={queryClient}>
        {/* <ImageScan /> */}
        {/* <RouterProvider router={router} /> */}
        {/* <IndividualMeal
          individualMeal={individualMeal}
          title={backendData.title}
          overview={backendData.instruction}
          image={backendData.imageUrl}
          source={backendData.source}
          totalTime="20 minutes"
          servings="4 servings"
          calories="150 kcal"
          averageStar="4.5"
          numReviews="10"
          tags={backendData.tags}
        /> */}

        {/* <NutritionCard {...mockdata} /> */}
        <ToastContainer autoClose={5000} limit={3} transition={Slide} />
        <ReactQueryDevtools />
        {/* <PersonalDashboardWrapper /> */}
      </QueryClientProvider>
    </ChakraBaseProvider>
  );
}
export default App;