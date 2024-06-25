import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';
import { initialState, getTemplateSlice } from './utils';
import { PostRequestType } from '../../components/community/post/types';

interface EditRequestPayload {
  postId: string;
  data: any;
}

export const editRequest = createAsyncThunk('editPost/edit', async ({ postId, data }: EditRequestPayload) => {
  const response = await customFetch.put(`/community/post/${postId}`, data);
  return { post: response.data.post };
});

export const EditPost = getTemplateSlice('editPost', initialState, editRequest);

export default EditPost.reducer;
