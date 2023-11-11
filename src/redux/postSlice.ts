// postSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "./store";
import { PostData } from "../types/types";
import {
  createPostApi,
  deletePostApi,
  fetchPostsWithAuthors,
  updatePostApi,
} from "../posts/api";

interface PostState {
  posts: PostData[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  status: "idle",
  error: null,
};

// Create an async thunk for fetching posts
export const fetchPosts = createAsyncThunk<PostData[]>(
  "posts/fetchPosts",
  async () => {
    try {
      return await fetchPostsWithAuthors();
    } catch (error) {
      console.error("Error fetching posts with authors:", error);
      throw new Error("Failed to fetch posts");
    }
  }
);

// Create an async thunk for creating a new post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (newPost: Omit<PostData, "id">) => {
    return await createPostApi(newPost);
  }
);

// Create an async thunk for updating a post
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (updatedPost: PostData) => {
    return await updatePostApi(updatedPost);
  }
);

// Create an async thunk for deleting a post
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async ({ postId, imgUrl }: { postId: string; imgUrl: string }) => {
    await deletePostApi(postId, imgUrl);
    return postId;
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch posts";
      })
      // Create post
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      // Update post
      .addCase(updatePost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const existingPost = state.posts.find(
          (post) => post.id === updatedPost.id
        );
        if (existingPost) {
          Object.assign(existingPost, updatedPost);
        }
      })
      // Delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.payload;
        state.posts = state.posts.filter((post) => post.id !== postId);
      });
  },
});

export const selectAllPosts = (state: RootState) => state.posts.posts;
export const selectPostById = (state: RootState, postId: string) =>
  state.posts.posts.find((post) => post.id === postId);

export default postSlice.reducer;
