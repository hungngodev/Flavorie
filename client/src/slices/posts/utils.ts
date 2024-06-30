import { createSlice } from '@reduxjs/toolkit';
export interface PostState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: any;
}
export const initialState: PostState = {
  status: 'idle',
  error: null,
};

export const getTemplateSlice = (name: string, initialState: any, thunk: any) => {
  return createSlice({
    name,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(thunk.fulfilled, (state) => {
          state.status = 'succeeded';
        })
        .addCase(thunk.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error;
        });
    },
  });
};
