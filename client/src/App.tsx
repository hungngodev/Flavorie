import { ChakraBaseProvider, extendTheme } from '@chakra-ui/react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import HomeLayout from './layouts/HomeLayout.tsx';
import { Ingredient, Login, Main, Meal, Register } from './pages/index';
import theme from './style/theme';
import IndividualMeal from './pages/Recipe.tsx';
import { Dish } from '@/components/meals/ImageSlide'
import PersonalDashboard from './pages/User.tsx';

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

const IndividualMealWrapper = () => {
  const sampleMeal: Dish[] = [
    {
      image: '../public/images/baked-brie-with-roasted-mushrooms.webp',
      title: 'Baked brie with roasted mushroom',
      description: ' Step 1: Bake brie and roasted mushroom.',
    },
    {
      image: '../public/images/apple-and-cheddar-crisp-salad-scaled.webp',
      title: 'Apple and cheddar crisp salad',
      description: 'Step 2: Wash salad and apple',
    },
    {
      image: '../public/images/buffalo-chicken-cobb-salad-scaled.webp',
      title: 'Buffalo chicken cobb salad',
      description: 'Step 3: Roast buffalo chicken',
    },
    {
      image: '../public/images/chocolate-raspberry-pavlova-stack-12-scaled.webp',
      title: 'Chocolate raspberry pavlova stack',
      description: 'Step 4: Wash raspberry',
    },
    {
      image: '../public/images/new-york-crumb-cake-7-scaled.webp',
      title: 'New york crumb cake',
      description: 'Step 5: Bake cake',
    },
    {
      image: '../public/images/summer-ricotta-grilled-vegetables.webp',
      title: 'Summer ricotta grilled vegetables',
      description: 'Step 6: Grilled vegetables after washing',
    },
  ];

  return (
    <IndividualMeal
      individualMeal={sampleMeal}
      title="Sample Meal Title"
      overview="This is an overview of the sample meal."
      totalTime="45 mins"
      servings="4"
      calories="500"
      averageStar='5'
      numReviews='1'
    />
  );
};

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

  const recentMeals = [
    { name: 'Bun bo', date: '04/28/2024' },
    { name: 'Spring roll', date: '05/20/2024' },
    { name: 'Grilled Cheese Sandwich', date: '05/30/2024' },
  ];

  const dashboardProps = {
    info: userInfo,
    totalMeals: '12',
    points: '8',
    tags: 'Lactose, Gym, Lunch',
    reviewsGiven: '4',
    recipesShared: '2',
    caloriesConsumed: '5100',
    badgesEarned: 'Daily Devotee',
    recentMeals: recentMeals,
    protein: '100g',
    vitamins: 'A, B3, D',
    carb: '150g',
    fat: '60g',
    minerals: 'Calcium, Ion',
  };

  return <PersonalDashboard {...dashboardProps} />;
}

function App() {
  return (
    <ChakraBaseProvider theme={extendTheme(theme)}>
      {/* <IndividualMealWrapper /> */}
      {/* <ImageScan /> */}
      <PersonalDashboardWrapper />
      {/* <RouterProvider router={router} /> */}
      <ToastContainer autoClose={5000} limit={3} transition={Slide} />
    </ChakraBaseProvider>
  );
}
export default App;
