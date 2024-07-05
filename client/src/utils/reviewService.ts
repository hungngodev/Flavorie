import customFetch from './customFetch';
import { response } from 'express';

export const createReview = async (postId: string, content: string, parentReviewId: string | null) => {
  try {
    const response = await customFetch.post(`/community/review/${postId}`, { content, parentReview: parentReviewId });
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create reply: ${error}`);
  }
};

export const updateReview = async (postId: string, content: string, reviewId: string) => {
  try {
    const response = await customFetch.put(
      `/community/reviews/${postId}/${reviewId}`,
      { content },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to edit review: ${error}`);
  }
};

export const deleteReview = async (postId: string, reviewId: string) => {
  try {
    const response = await customFetch.delete(`/community/reviews/${postId}/${reviewId}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete review: ${error}`);
  }
};
