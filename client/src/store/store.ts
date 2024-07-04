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
import {
  getReviewReducer,
  createReviewReducer,
  editReviewReducer,
  deleteReviewReducer,
  reviewReducer,
} from '../slices/reviews';

export const store = configureStore({
  reducer: {
    posts: postReducer,
    createPost: createPostReducer,
    likePost: likePostReducer,
    editPost: editPostReducer,
    deletePost: deletePostReducer,
    savePost: savePostReducer,
    hidePost: hidePostReducer,
    getReview: getReviewReducer,
    createReview: createReviewReducer,
    editReview: editReviewReducer,
    deleteReview: deleteReviewReducer,
    reviews: reviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
