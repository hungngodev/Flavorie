import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import customFetch from '../../utils/customFetch';
import { getTemplateSlice, initialState } from '../utils';

export const hideRequest = createAsyncThunk('hidePost/hide', async ({ postId }: { postId: string }) => {
  const response = await customFetch.post(`/community/post/hide/${postId}`);
  return { post: response.data.post };
});

export const HidePost = getTemplateSlice('hidePost', initialState, hideRequest);

export const selectHideStatus = (state: RootState) => state.hidePost.status;

export default HidePost.reducer;
