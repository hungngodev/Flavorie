import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';
import { initialState, getTemplateSlice } from './utils';

export const deleteRequest = createAsyncThunk('deletePost/delete', async (postId: string | undefined) => {
  if (!postId) return null;
  const response = await customFetch.delete(`/community/post/${postId}`);
  return { postId: postId, message: response.data.message };
});

export const DeletePost = getTemplateSlice('deletePost', initialState, deleteRequest);

export default DeletePost.reducer;
