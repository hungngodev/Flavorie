import { createAsyncThunk } from '@reduxjs/toolkit';
import { ReviewRequestType } from '../../components/community/review/types';
import customFetch from '../../utils/customFetch';
import { getTemplateSlice, initialState } from '../utils';

export const deleteReview = createAsyncThunk(
  'deleteReview/fetchReview',
  async ({ postId, reviewId }: { postId: string; reviewId: string }) => {
    const response = await customFetch.post(`/community/review/${postId}/${reviewId}`);
    return { review: response.data };
  },
);

export const DeleteReview = getTemplateSlice('deleteReview', initialState, deleteReview);

export default DeleteReview.reducer;
