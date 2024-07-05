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
            // state.posts = [...action.payload.posts];
            console.log(state);
            return { posts: [...action.payload.posts] };
        },

        addPosts: (state: PostState, action: PayloadAction<{ post: PostObjectType[] }>) => {
            const newPosts = action.payload.post.concat(state.posts);
            return { posts: newPosts };
        },

        reactPost: (state: PostState, action: PayloadAction<{ postIndex: number; reacts: Array<string> }>) => {
            const { postIndex, reacts } = action.payload;

            const updatedPost = { ...state.posts[postIndex] };

            updatedPost.reacts = [...reacts];

            const updatedPosts = [...state.posts];
            updatedPosts[postIndex] = updatedPost;

            state.posts = updatedPosts;
        },

        updatePost: (state: PostState, action: PayloadAction<{ post: PostObjectType[] }>) => {
            const { post } = action.payload;
            const postIndex = state.posts.findIndex((p) => p.id === post[0].id);

            if (postIndex !== -1) {
                // Check if the post was found
                const updatedPosts = [...state.posts];
                console.log('updated posts: ');
                console.log(updatedPosts);
                updatedPosts[postIndex] = post[0];
                return { posts: [...updatedPosts] };
            }
            return state;
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

export const selectPosts = (state: RootState): PostObjectType[] => state.posts.posts;

export const selectPostsByIndex = (index: number) => (state: RootState) => state.posts.posts[index] as PostObjectType;

export const selectPostById = (postId: string) => (state: RootState) =>
    state.posts.posts.find((post) => post.id === postId) as PostObjectType;

export default PostSlice.reducer;
