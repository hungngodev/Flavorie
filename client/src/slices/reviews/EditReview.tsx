import { createAsyncThunk } from '@reduxjs/toolkit';
import { ReviewRequestType } from '../../components/community/review/types';
import customFetch from '../../utils/customFetch';
import { getTemplateSlice, initialState } from '../utils';

export const editReviewRequest = createAsyncThunk(
  'editReview/fetchReview',
  async ({ postId, reviewId, content }: { postId: string; reviewId: string; content: string }) => {
    const response = await customFetch.put(`/community/review/${postId}/${reviewId}`, { content: content });
    return { review: response.data };
  },
);

export const EditReview = getTemplateSlice('editReview', initialState, editReviewRequest);

export const selectEditReviewStatus = (state: any) => (state.editReview as any).status;

export default EditReview.reducer;
