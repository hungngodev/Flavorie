import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReviewObjectType } from '../../components/community/review/types';
import { RootState } from '../../store/store';

interface ReviewState {
    ids: string[];
    reviews: { [key: string]: ReviewObjectType };
}

const initialState: ReviewState = {
    ids: [],
    reviews: {},
};

export const ReviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        addReview: (state: ReviewState, action: PayloadAction<{ review: ReviewObjectType }>) => {
            state.ids.push(action.payload.review.id);
            state.reviews[action.payload.review.id] = action.payload.review;
        },
        updateReview: (state: ReviewState, action: PayloadAction<{ review: ReviewObjectType }>) => {
            state.reviews[action.payload.review.id] = action.payload.review;
        },
        deleteReview: (state: ReviewState, action: PayloadAction<{ reviewId: string }>) => {
            state.ids = state.ids.filter((id) => id !== action.payload.reviewId);
            delete state.reviews[action.payload.reviewId];
        },
    },
});

export const { addReview, updateReview, deleteReview } = ReviewSlice.actions;

export const getReviewById = (reviewId: string) => (state: RootState) => state.reviews.reviews[reviewId];

export default ReviewSlice.reducer;
