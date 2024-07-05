import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';
import { getTemplateSlice, initialState } from '../utils';
import { RootState } from '../../store/store';

interface EditRequestPayload {
  postId: string;
  newFormData: any;
}

export const editPostRequest = createAsyncThunk(
  'editPost/edit',
  async ({ postId, newFormData }: EditRequestPayload) => {
    const response = await customFetch.put(`/community/post/${postId}`, newFormData);
    return { post: response.data.post };
  },
);

export const EditPost = getTemplateSlice('editPost', initialState, editPostRequest);
export const selectPostEditStatus = (state: RootState) => (state.editPost as any).status;

export default EditPost.reducer;
