import React, { useState } from 'react';
import { Box, ChakraBaseProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import HomeLayout from './layouts/HomeLayout';
import { Ingredient, loader as ingredientsLoader } from './pages/Ingredient.tsx';
import { loader as mealsLoader } from './pages/Meal.tsx';
import { loader as recipeLoader } from './pages/Recipe';
import { Ingredient, Login, Main, Meal, Recipe, Register, User } from './pages/index';
import theme from './style/theme';
import IndividualMeal from './pages/Recipe';
import { BackendData } from './components/meals/ImageSlide';
import NutritionCard from './components/ingredients/NutritionCard';
import { IngredientProps } from './components/ingredients/NutritionCard';
import ReviewCard, { Review } from './components/community/reviewCard';
import { identity } from 'lodash';
import ReviewForm from './components/form/Review';

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

// const mockComments: Review[] = [
//   {
//     id: '001',
//     author: {
//       username: 'Alex B',
//       src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0WU10MyuUxOw4QSiIEzWPZn3sfytEl7Z4RA&s',
//     },
//     content: 'Parent comment.',
//     timestamp: '2024-02-06T17:30:00Z',
//     children: [
//       {
//         id: '002',
//         author: {
//           username: 'Bill K',
//           src: 'https://akns-images.eonline.com/eol_images/Entire_Site/2023013/rs_1024x759-230113124412-1024-Phineas-and-Ferb-perry.ct.jpg?fit=around%7C1024:759&output-quality=90&crop=1024:759;center,top',
//         },
//         content: 'First child comment',
//         timestamp: '2024-02-07T10:30:00Z',
//         children: [],
//       },
//       {
//         id: '003',
//         author: {
//           username: 'Celine',
//           src: 'https://facts.net/wp-content/uploads/2023/09/22-facts-about-bubbles-the-powerpuff-girls-1694408222.jpg',
//         },
//         content: 'Second child comment',
//         timestamp: '2024-02-07T10:30:00Z',
//         children: [],
//       },
//       {
//         id: '004',
//         author: {
//           username: 'Jay M',
//           src: 'https://i.scdn.co/image/ab6761610000e5eb7ac3385e1033229ea480dc9d',
//         },
//         content: 'Third child comment',
//         timestamp: '2024-02-07T10:30:00Z',
//         children: [],
//       },
//       {
//         id: '005',
//         author: {
//           username: 'Calvin',
//           src: '',
//         },
//         content: 'Forth child comment',
//         timestamp: '2024-02-08T12:45:00Z',
//         children: [],
//       },
//     ],
//   },
// ];

function App() {
  // const [comments, setComments] = useState<Review[]>(mockComments);

  // const handleNewComment = (content: string) => {
  //   const newComment: Review = {
  //     id: (comments.length + 1).toString(),
  //     author: { username: 'New User', src: 'path_to_new_user_avatar.jpg' }, 
  //     content,
  //     timestamp: new Date().toISOString(),
  //     children: [],
  //   };
  //   setComments([...comments, newComment]);
  // };

  // const handleReply = (content: string, parentReviewId: string) => {
  //   const addReply = (reviews: Review[]): Review[] => {
  //     return reviews.map((review) => {
  //       if (review.id === parentReviewId) {
  //         return {
  //           ...review,
  //           children: [
  //             ...review.children,
  //             {
  //               id: (reviews.length + 1).toString(),
  //               author: { username: 'New User', src: 'path_to_new_user_avatar.jpg' }, 
  //               content,
  //               timestamp: new Date().toISOString(),
  //               children: [],
  //             },
  //           ],
  //         };
  //       }
  //       return {
  //         ...review,
  //         children: addReply(review.children),
  //       };
  //     });
  //   };
  //   setComments(addReply(comments));
  // };

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
      {/* <Box>
        {comments.map((review) => (
          <ReviewCard key={review.id} review={review} onReply={handleReply} />
        ))}
        <Box ml="5" mt="2">
          <ReviewForm
            onSubmit={handleNewComment}
            avatar={{ username: 'New User', src: 'path_to_new_user_avatar.jpg' }}
          />
        </Box>
      </Box> */}
      <ToastContainer autoClose={5000} limit={3} transition={Slide} />
      <ReactQueryDevtools />
      </QueryClientProvider>
    </ChakraBaseProvider>
  );
}
export default App; 
