import { configureStore } from '@reduxjs/toolkit';
import createPostReducer from '../slices/posts/CreatePost';
import postsReducer from '../slices/posts/PostState';
export const store = configureStore({
  reducer: {
    createPost: createPostReducer,
    posts: postsReducer, // Add your createPost slice here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
