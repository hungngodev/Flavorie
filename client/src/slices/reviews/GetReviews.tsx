import { createAsyncThunk } from '@reduxjs/toolkit';
import { ReviewRequestType } from '../../components/community/review/types';
import customFetch from '../../utils/customFetch';
import { getTemplateSlice, initialState } from '../utils';

export const getReviews = createAsyncThunk('getReviews/fetchReview', async (postId: string) => {
  const response = await customFetch.get(`/community/review/${postId}`);
  return { review: response.data };
});

export const GetReviews = getTemplateSlice('getReviews', initialState, getReviews);

export default GetReviews.reducer;
