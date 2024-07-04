import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import customFetch from '../../utils/customFetch';
import { getTemplateSlice, initialState } from '../utils';

export const likePostRequest = createAsyncThunk('likePost/like', async (postId: string) => {
  const response = await customFetch.post(`/community/post/react/${postId}`);
  return { postId: postId, reacts: response.data.reacts };
});

export const LikePost = getTemplateSlice('likePost', initialState, likePostRequest);

export const selectLikeStatus = (state: RootState) => (state.likePost as any).status;

export default LikePost.reducer;
