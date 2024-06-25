import { configureStore } from '@reduxjs/toolkit';
import {
  createPostReducer,
  postReducer,
  likePostReducer,
  editPostReducer,
  deletePostReducer,
} from '../slices/posts/index';

export const store = configureStore({
  reducer: {
    posts: postReducer,
    createPost: createPostReducer,
    likePost: likePostReducer,
    editPost: editPostReducer,
    deletePost: deletePostReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
