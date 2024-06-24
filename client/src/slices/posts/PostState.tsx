import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';
import { PostObjectType } from '../../components/community/post/types';
import { RootState } from '../../store/store';

interface PostState {
  posts: PostObjectType[];
}

const initialState: PostState = {
  posts: [],
};

export const PostSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPosts: (state, action: PayloadAction<PostObjectType[]>) => {
      state.posts = [...state.posts, ...action.payload];
    },
    reactPost: (state, action: PayloadAction<{ postId: string; reacts: Array<string> }>) => {
      const { postId, reacts } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        post.reacts = reacts;
      }
    },
  },
});

export const { addPosts, reactPost } = PostSlice.actions;

export const selectPosts = (state: RootState) => state.posts.posts;

export const selectPostsByIndex = (index: number) => (state: RootState) => state.posts.posts[index];

export const selectPostsLength = (state: RootState) => state.posts.posts.length;

export const selectReactsByPostId = (postId: string) => (state: RootState) => {
  const post = state.posts.posts.find((post) => post.id === postId);
  return post ? post.reacts : [];
};

export const selectIsPostLikedByUser = (postId: string, userId: string) => (state: RootState) => {
  const post = state.posts.posts.find((post) => post.id === postId);
  return post && post.reacts ? post.reacts.includes(userId) : false;
};

export default PostSlice.reducer;
