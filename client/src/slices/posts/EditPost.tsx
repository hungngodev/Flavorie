import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';
import { getTemplateSlice, initialState } from '../utils';

interface EditRequestPayload {
  postId: string;
  newFormData: any;
}

export const editRequest = createAsyncThunk('editPost/edit', async ({ postId, newFormData }: EditRequestPayload) => {
  const response = await customFetch.put(`/community/post/${postId}`, newFormData);
  return { post: response.data.post };
});

export const EditPost = getTemplateSlice('editPost', initialState, editRequest);

export default EditPost.reducer;
