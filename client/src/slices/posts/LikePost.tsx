import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';
import { RootState } from '../../store/store';

interface PostState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: any;
}
const initialState: PostState = {
  status: 'idle',
  error: null,
};

export const likeRequest = createAsyncThunk('likePost/like', async (postId: string) => {
  const response = await customFetch.post(`/community/post/react/${postId}`);
  return { postId: postId, reacts: response.data.reacts };
});

export const LikePost = createSlice({
  name: 'likePost',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(likeRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(likeRequest.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(likeRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      });
  },
});

export default LikePost.reducer;
