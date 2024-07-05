import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';
import { getTemplateSlice, initialState } from '../utils';

export const getReviewsRequest = createAsyncThunk('getReviews/fetchReview', async (postId: string) => {
    const response = await customFetch.get(`/community/review/${postId}`);
    return { review: response.data };
});

export const GetReviews = getTemplateSlice('getReviews', initialState, getReviewsRequest);

export default GetReviews.reducer;
