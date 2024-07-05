import { createAsyncThunk } from '@reduxjs/toolkit';
import { PostRequestType } from '../../components/community/post/types';
import customFetch from '../../utils/customFetch';
import { getTemplateSlice, initialState } from '../utils';
import { RootState } from '../../store/store';

export const createPostRequest = createAsyncThunk('createPost/fetchPost', async (data: PostRequestType) => {
  const formData = new FormData();

  formData.append('header', data.header);
  formData.append('body', data.body);
  formData.append('privacy', data.privacy);
  formData.append('location', data.location);

  data.media.forEach((mediaObj) => {
    formData.append('media', mediaObj.file);
  });
  const response = await customFetch.post('/community/post', formData);
  return { post: response.data.post };
});

export const CreatePost = getTemplateSlice('createPost', initialState, createPostRequest);
export const selectPostCreateStatus = (state: RootState) => (state.createPost as any).status;

export default CreatePost.reducer;
