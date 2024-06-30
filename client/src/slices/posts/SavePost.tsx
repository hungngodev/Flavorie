import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import customFetch from '../../utils/customFetch';
import { getTemplateSlice, initialState } from './utils';

export const saveRequest = createAsyncThunk('savePost/save', async ({ postId }: { postId: string }) => {
  const response = await customFetch.post(`/community/post/save/${postId}`);
  return { post: response.data.post };
});

export const SavePost = getTemplateSlice('savePost', initialState, saveRequest);

export const selectSaveStatus = (state: RootState) => state.savePost.status;

export default SavePost.reducer;
