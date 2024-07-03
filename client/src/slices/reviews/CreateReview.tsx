import { createAsyncThunk } from '@reduxjs/toolkit';
import { ReviewRequestType } from '../../components/community/review/types';
import customFetch from '../../utils/customFetch';
import { getTemplateSlice, initialState } from '../utils';

export const createReview = createAsyncThunk('createReview/fetchReview', async (data: ReviewRequestType) => {
  const response = await customFetch.post(`/community/review/${data.postId}`, {
    content: data.content,
    parentReview: data.parentReview,
  });
  return { review: response.data };
});

export const CreateReview = getTemplateSlice('createReview', initialState, createReview);

export default CreateReview.reducer;
