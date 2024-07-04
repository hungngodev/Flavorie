import { createAsyncThunk } from '@reduxjs/toolkit';
import { ReviewRequestType } from '../../components/community/review/types';
import customFetch from '../../utils/customFetch';
import { getTemplateSlice, initialState } from '../utils';
import { RootState } from '../../store/store';

export const createReviewRequest = createAsyncThunk('createReview/fetchReview', async (data: ReviewRequestType) => {
  const response = await customFetch.post(`/community/review/${data.postId}`, {
    content: data.content,
    parentReview: data.parentReview,
  });
  return { review: response.data };
});

export const CreateReview = getTemplateSlice('createReview', initialState, createReviewRequest);
export const selectCreateReviewStatus = (state: RootState) => (state.createReview as any).status;
export default CreateReview.reducer;
