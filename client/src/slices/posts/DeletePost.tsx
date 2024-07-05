import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import customFetch from '../../utils/customFetch';
import { getTemplateSlice, initialState } from '../utils';

export const deletePostRequest = createAsyncThunk('deletePost/delete', async (postId: string | undefined) => {
  if (!postId) return null;
  const response = await customFetch.delete(`/community/post/${postId}`);
  return { postId: postId, message: response.data.message };
});

export const DeletePost = getTemplateSlice('deletePost', initialState, deletePostRequest);

export const selectDeleteStatus = (state: RootState): any => (state.deletePost as any).status;
export default DeletePost.reducer;
