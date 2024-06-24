import { configureStore } from '@reduxjs/toolkit';
import createPostReducer from '../slices/posts/CreatePost';
export const store = configureStore({
  reducer: {
    createPost: createPostReducer, // Add your createPost slice here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
