import { configureStore } from '@reduxjs/toolkit';
import {
  createPostReducer,
  deletePostReducer,
  editPostReducer,
  hidePostReducer,
  likePostReducer,
  postReducer,
  savePostReducer,
} from '../slices/posts/index';

export const store = configureStore({
  reducer: {
    posts: postReducer,
    createPost: createPostReducer,
    likePost: likePostReducer,
    editPost: editPostReducer,
    deletePost: deletePostReducer,
    savePost: savePostReducer,
    hidePost: hidePostReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
