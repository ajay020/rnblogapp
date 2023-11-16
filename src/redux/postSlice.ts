// postSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "./store";
import { PostData } from "../types/types";
import {
  createPostApi,
  deletePostApi,
  dislikePostApi,
  fetchPostsWithAuthors,
  likePostApi,
  updatePostApi,
} from "../posts/api";

interface PostState {
  posts: PostData[];
  status: "idle" | "loading" | "succeeded" | "failed";
  loadingCreate: boolean;
  loadingUpdate: boolean;
  loadingDelete: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  status: "idle",
  loadingCreate: false,
  loadingUpdate: false,
  loadingDelete: false,
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
  async ({
    postId,
    imgUrl,
  }: {
    postId: string;
    imgUrl: string | undefined;
  }) => {
    await deletePostApi(postId, imgUrl);
    return postId;
  }
);

export const likePostAsync = createAsyncThunk<void, string>(
  "posts/likePostAsync",
  async (postId) => {
    likePostApi(postId);
  }
);

export const dislikePostAsync = createAsyncThunk<void, string>(
  "posts/dislikePostAsync",
  async (postId) => {
    dislikePostApi(postId);
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
      .addCase(createPost.pending, (state) => {
        state.loadingCreate = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loadingCreate = false;
        state.status = "failed";
        state.error = action.error.message ?? "Failed to create post";
      })
      // Update post
      .addCase(updatePost.pending, (state) => {
        state.loadingUpdate = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        const updatedPost = action.payload;
        const existingPost = state.posts.find(
          (post) => post.id === updatedPost.id
        );
        if (existingPost) {
          Object.assign(existingPost, updatedPost);
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.status = "failed";
        state.error = action.error.message ?? "Failed to update post";
      })
      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.loadingDelete = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loadingDelete = false;
        const postId = action.payload;
        state.posts = state.posts.filter((post) => post.id !== postId);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loadingDelete = false;
        state.status = "failed";
        state.error = action.error.message ?? "Failed to delete post";
      })
      .addCase(likePostAsync.fulfilled, (state, action) => {
        const postId = action.meta.arg;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          post.likesCount += 1;
        }
      })
      .addCase(dislikePostAsync.fulfilled, (state, action) => {
        const postId = action.meta.arg;
        const post = state.posts.find((p) => p.id === postId);
        if (post && post.likesCount > 0) {
          post.likesCount -= 1;
        }
      });
  },
});

export const selectAllPosts = (state: RootState) => state.posts.posts;
export const selectPostById = (state: RootState, postId: string) =>
  state.posts.posts.find((post) => post.id === postId);

export default postSlice.reducer;
