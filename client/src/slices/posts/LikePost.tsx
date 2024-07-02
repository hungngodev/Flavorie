import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';
import { initialState, getTemplateSlice } from './utils';

export const likeRequest = createAsyncThunk('likePost/like', async (postId: string) => {
  const response = await customFetch.post(`/community/post/react/${postId}`);
  return { postId: postId, reacts: response.data.reacts };
});

export const LikePost = getTemplateSlice('likePost', initialState, likeRequest);

export default LikePost.reducer;
