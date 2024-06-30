import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import customFetch from '../../utils/customFetch';
import { getTemplateSlice, initialState } from './utils';

interface EditRequestPayload {
  postId: string;
  newFormData: any;
}

export const updateRequest = createAsyncThunk('editPost/edit', async ({ postId, newFormData }: EditRequestPayload) => {
  const response = await customFetch.put(`/community/post/${postId}`, newFormData);
  return { post: response.data.post };
});

export const EditPost = getTemplateSlice('editPost', initialState, updateRequest);

export const selectUpdateStatus = (state: RootState) => state.editPost.status;

export default EditPost.reducer;
