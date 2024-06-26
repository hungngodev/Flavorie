import { createAsyncThunk } from '@reduxjs/toolkit';
import { PostRequestType } from '../../components/community/post/types';
import customFetch from '../../utils/customFetch';
import { initialState, getTemplateSlice } from './utils';

export const createRequest = createAsyncThunk('createPost/fetchPost', async (data: PostRequestType) => {
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

export const CreatePost = getTemplateSlice('createPost', initialState, createRequest);

export default CreatePost.reducer;
