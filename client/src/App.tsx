import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as ReduxProvider } from 'react-redux';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import HomeLayout from './layouts/HomeLayout';
import { loader as FeedLoader } from './pages/Feed.tsx';
import { loader as PostLoader } from './pages/FullPost.tsx';
import { loader as ingredientsLoader } from './pages/Ingredient.tsx';
import { loader as mealsLoader } from './pages/Meal.tsx';
import NotificationPage from './pages/NotificationPage.tsx';
import Receipt from './pages/Receipt.tsx';
import ReceiptScan from './pages/ReceiptScan.tsx';
import { loader as recipeLoader } from './pages/Recipe.tsx';
import { Feed, FullPost, Ingredient, Login, Main, Meal, Recipe, Register } from './pages/index';
import ToastProvider from './providers/ToastProvider.tsx';
import { store as reduxStore } from './store/store';
import theme from './style/theme';
import IndividualMeal from './pages/Recipe';
import { BackendData } from './components/meals/ImageSlide';
import User from './pages/User';
import { TableData } from './pages/User';
// import { MealProps } from './pages/Recipe';
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

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <HomeLayout />,
//     children: [
//       {
//         index: true,
//         element: <Main />,
//       },
//       {
//         path: 'register',
//         element: <Register />,
//       },
//       {
//         path: 'login',
//         element: <Login />,
//       },
//       {
//         path: 'ingredients',
//         element: <Outlet />,
//         children: [
//           {
//             index: true,
//             element: <div>HIHIH</div>,
//           },
//           {
//             path: ':category',
//             element: <Ingredient />,
//             loader: ingredientsLoader(queryClient),
//           },
//         ],
//       },
//       {
//         path: 'meals',
//         children: [
//           {
//             index: true,
//             element: <Meal />,
//             loader: mealsLoader(queryClient),
//           },
//           {
//             path: ':mealId',
//             element: <Recipe />,
//             loader: recipeLoader(queryClient),
//           },
//         ],
//       },
//       {
//         path: 'community',
//         children: [
//           {
//             index: true,
//             element: <Feed />,
//             loader: FeedLoader(queryClient),
//           },
//           {
//             path: ':postId',
//             element: <FullPost />,
//             loader: PostLoader(queryClient),
//           },
//         ],
//       },

//       {
//         path: 'profile',
//         element: <User />,
//       },
//       {
//         path: 'upload-receipts',
//         element: <ReceiptScan />,
//       },
//       {
//         path: 'notifications',
//         element: <NotificationPage />,
//       },
//       {
//         path: 'receipts/:id',
//         element: <Receipt />,
//       },
//       // {
//       //   path: 'notifications/:id',
//       //   element: <NotificationDetailPage />
//       // }
//       // {
//       //   path: 'receipts-test',
//       //   element: <Receipt />
//       // }
//     ],
//   },
// ]);


const PersonalDashboardWrapper = () => {
  const userInfo = {
    avatar: {
      src: "../public/images/1989-Taylors-Version.webp",
      username: "Alex B",
    },
    name: "Alex",
    lastname: "B",
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
    totalPosts: 5,
    recipesShared: 8,
    recipesRated: 3,
    totalPoints: 10,
    badgesEarned: 1,
    recentMeals: recentMeals,
    protein: '210',
    vitamins: '48',
    carb: '190',
    fat: '120',
    minerals: '42',
    weeklySummaryData: weeklyData,
    weeklyCaloriesData: weeklyCalories,
  };
  return <User {...dashboardProps} />;
}

function App() {
  return (
    <ChakraProvider theme={extendTheme(theme)}>
      <ToastProvider>
        <ReduxProvider store={reduxStore}>
          <QueryClientProvider client={queryClient}>
            {/* <RouterProvider router={router} /> */}
            <ToastContainer autoClose={5000} limit={3} transition={Slide} />
            <ReactQueryDevtools initialIsOpen={false} />
            <PersonalDashboardWrapper />
          </QueryClientProvider>
        </ReduxProvider>
      </ToastProvider> 
    </ChakraProvider>
  );
}
export default App;