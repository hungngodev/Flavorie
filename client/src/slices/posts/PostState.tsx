import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
    getFeed: (state: PostState, action: PayloadAction<{ posts: PostObjectType[] }>) => {
      state.posts = [...action.payload.posts];
    },
    addPosts: (state: PostState, action: PayloadAction<{ post: PostObjectType[] }>) => {
      const newPosts = action.payload.post.concat(state.posts);
      console.log(newPosts);
      return { posts: newPosts };
    },

    reactPost: (state: PostState, action: PayloadAction<{ postIndex: number; reacts: Array<string> }>) => {
      const { postIndex, reacts } = action.payload;
      state.posts[postIndex].reacts = reacts;
    },

    updatePost: (state: PostState, action: PayloadAction<{ postIndex: number; post: PostObjectType[] }>) => {
      const { postIndex, post } = action.payload;
      const updatedPosts = [...state.posts];
      updatedPosts[postIndex] = post[0];
      return { posts: updatedPosts };
    },

    deletePost: (state: PostState, action: PayloadAction<{ postId: string | undefined }>) => {
      const { postId } = action.payload;
      if (!postId) return;
      const newPosts = state.posts.filter((post) => post.id !== action.payload.postId);
      state.posts = newPosts;
    },
  },
});

export const { addPosts, reactPost, updatePost, deletePost, getFeed } = PostSlice.actions;

export const selectPosts = (state: RootState) => state.posts.posts;

export const selectPostsByIndex = (index: number) => (state: RootState) => state.posts.posts[index];

export default PostSlice.reducer;
