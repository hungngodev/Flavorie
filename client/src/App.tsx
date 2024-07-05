import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as ReduxProvider } from 'react-redux';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import { HomeLayout, MeetingLayout, RoomLayout } from './layouts';
import { loader as PostLoader } from './pages/FullPost';
import { loader as ingredientsLoader } from './pages/Ingredient';
import { loader as mealsLoader } from './pages/Meal';
import Receipt from './pages/Receipt';
import ReceiptScan from './pages/ReceiptScan';
import { loader as recipeLoader } from './pages/Recipe';
import {
    Feed,
    FullPost,
    Ingredient,
    Login,
    Main,
    Meal,
    Meeting,
    Notifications,
    Recipe,
    Register,
    Room,
    User,
} from './pages/index';
import ToastProvider from './providers/ToastProvider';
import { store as reduxStore } from './store/store';
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
            {
                path: 'ingredients',
                element: <Outlet />,
                children: [
                    {
                        index: true,
                        element: <Ingredient />,
                        loader: ingredientsLoader(queryClient),
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
                        element: <Feed />,
                    },
                    {
                        path: ':postId',
                        element: <FullPost />,
                        loader: PostLoader(queryClient),
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
                element: <Notifications />,
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
            {
                path: 'meeting',
                element: <MeetingLayout />,
                children: [
                    {
                        index: true,
                        element: <Meeting />,
                    },
                    {
                        path: 'room/:id',
                        element: <RoomLayout />,
                        children: [
                            {
                                index: true,
                                element: <Room />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);

function App() {
    return (
        <ChakraProvider theme={extendTheme(theme)}>
            <ToastProvider>
                <ReduxProvider store={reduxStore}>
                    <QueryClientProvider client={queryClient}>
                        <RouterProvider router={router} />
                        <ToastContainer autoClose={5000} limit={3} transition={Slide} />
                        <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                </ReduxProvider>
            </ToastProvider>
        </ChakraProvider>
    );
}
export default App;
