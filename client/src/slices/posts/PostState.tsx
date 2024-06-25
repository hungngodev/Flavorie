import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PostObjectType, PostEditObjectType, MediaObjectType } from '../../components/community/post/types';
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
    addPosts: (state, action: PayloadAction<{ postIndex?: number | null; post: PostObjectType[] }>) => {
      const { postIndex } = action.payload;
      if (postIndex) {
        state.posts[postIndex] = action.payload.post[0];
        return;
      }
      state.posts = [...state.posts, ...action.payload.post];
    },

    reactPost: (state, action: PayloadAction<{ postIndex: number; reacts: Array<string> }>) => {
      const { postIndex, reacts } = action.payload;
      state.posts[postIndex].reacts = reacts;
    },

    updatePost: (state, action: PayloadAction<{ postIndex?: number | null; post: PostObjectType[] }>) => {
      console.log(action.payload.post);
      if (!action.payload.postIndex) return;
      const { postIndex, post } = action.payload;
      state.posts[postIndex] = post[0];
      console.log('updated post:', state.posts[postIndex]);
    },

    updateMediaPost: (state, action: PayloadAction<{ postIndex: number; media: MediaObjectType[] }>) => {
      const { media, postIndex } = action.payload;
      const originalMedia = state.posts[postIndex].media;
      if (originalMedia.length === 0 || media.length === 0) {
        return state;
      }
      if (originalMedia.every((value, index) => value === media[index])) {
        return state;
      }
      if (media.length < originalMedia.length) {
        state.posts[action.payload.postIndex].media = media;
        return state;
      }
    },

    deletePost: (state, action: PayloadAction<{ postIndex: number }>) => {
      const { postIndex } = action.payload;
      if (action.payload.postIndex === null || state.posts.length === 0) return;
      const updatePosts = state.posts.slice(postIndex, 1);
      state.posts = updatePosts;
    },
  },
});

export const { addPosts, reactPost, updatePost, updateMediaPost, deletePost } = PostSlice.actions;

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

// return the current saved data of a post
export const selectPostPreloadByIndex = (index: number) => (state: RootState) => {
  if (state.posts.posts.length === 0 || index > state.posts.posts.length) return null;

  const savedPost = state.posts.posts[index];
  const preload: PostEditObjectType = {
    header: savedPost.header,
    body: savedPost.body,
    privacy: savedPost.privacy,
    location: savedPost.location,
    media: [],
    savedPreviewMedia: savedPost.media,
  };
  return preload;
};

export default PostSlice.reducer;
