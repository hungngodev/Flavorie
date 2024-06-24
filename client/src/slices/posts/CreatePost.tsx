import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PostRequestType } from '../../components/community/post/form/PostFormExpand';
import customFetch from '../../utils/customFetch';
import { z } from 'zod';

interface PostState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: any;
}
const initialState: PostState = {
  status: 'idle',
  error: null,
};

export const fetchPost = createAsyncThunk('createPost/fetchPost', async (data: PostRequestType) => {
  const formData = new FormData();

  formData.append('header', data.header);
  formData.append('body', data.body);
  formData.append('privacy', data.privacy);
  formData.append('location', data.location);

  data.media.forEach((mediaObj) => {
    formData.append('media', mediaObj.file);
  });
  const response = await customFetch.post('/community/post', formData);
  return response.data.post;
});

export const NewFeedSlice = createSlice({
  name: 'createPost',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPost.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      });
  },
});

export default NewFeedSlice.reducer;
