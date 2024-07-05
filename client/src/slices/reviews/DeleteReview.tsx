import { createAsyncThunk } from '@reduxjs/toolkit';
import { ReviewRequestType } from '../../components/community/review/types';
import customFetch from '../../utils/customFetch';
import { getTemplateSlice, initialState } from '../utils';
import { RootState } from '../../store/store';

export const deleteReviewRequest = createAsyncThunk(
  'deleteReview/fetchReview',
  async ({ postId, reviewId }: { postId: string; reviewId: string }) => {
    const response = await customFetch.delete(`/community/review/${postId}/${reviewId}`);
    return { review: response.data };
  },
);

export const DeleteReview = getTemplateSlice('deleteReview', initialState, deleteReviewRequest);

export const selectDeleteReviewStatus = (state: RootState) => (state.deleteReview as any).status;

export default DeleteReview.reducer;
