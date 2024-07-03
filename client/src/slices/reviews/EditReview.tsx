import { createAsyncThunk } from '@reduxjs/toolkit';
import { ReviewRequestType } from '../../components/community/review/types';
import customFetch from '../../utils/customFetch';
import { getTemplateSlice, initialState } from '../utils';

export const editReview = createAsyncThunk(
  'editReview/fetchReview',
  async ({ postId, reviewId }: { postId: string; reviewId: string }) => {
    const response = await customFetch.put(`/community/review/${postId}/${reviewId}`);
    return { review: response.data };
  },
);

export const EditReview = getTemplateSlice('editReview', initialState, editReview);

export default EditReview.reducer;
