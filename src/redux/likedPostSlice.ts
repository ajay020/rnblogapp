// likedPostsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getAuth } from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { RootState } from "./store";
import { fetchLikedPostsApi } from "../posts/api";

interface LikedPostsState {
  likedPostIds: string[];
  dislikedPostIds: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: LikedPostsState = {
  likedPostIds: [],
  dislikedPostIds: [],
  status: "idle",
  error: null,
};

export const saveLikedPostsAsync = createAsyncThunk<
  void,
  { liked: string[]; disliked: string[] }
>("likedPosts/saveLikedPostsAsync", async ({ liked, disliked }) => {
  const userUid = getAuth().currentUser?.uid;
  if (userUid) {
    const likedPostsRef = doc(db, "likedPosts", userUid);
    await setDoc(likedPostsRef, { liked, disliked });
  }
});

export const fetchLikedPostsAsync = createAsyncThunk<
  { liked: string[]; disliked: string[] },
  string
>("likedPosts/fetchLikedPostsAsync", async (userUid: string) => {
  return await fetchLikedPostsApi(userUid);
});

const likedPostsSlice = createSlice({
  name: "likedPosts",
  initialState,
  reducers: {
    likePost: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      if (!state.likedPostIds?.includes(postId)) {
        state.likedPostIds.push(postId);
        // Remove from disliked list if it was disliked before
        state.dislikedPostIds = state.dislikedPostIds.filter(
          (id) => id !== postId
        );
      }
    },
    dislikePost: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      if (!state.dislikedPostIds?.includes(postId)) {
        state.dislikedPostIds.push(postId);
        // Remove from liked list if it was liked before
        state.likedPostIds = state.likedPostIds.filter((id) => id !== postId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveLikedPostsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveLikedPostsAsync.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(saveLikedPostsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to save liked posts";
      })
      .addCase(fetchLikedPostsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLikedPostsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.likedPostIds = action.payload.liked;
        state.dislikedPostIds = action.payload.disliked;
      })
      .addCase(fetchLikedPostsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch liked posts";
      });
  },
});

export const { likePost, dislikePost } = likedPostsSlice.actions;
export const selectLikedPostIds = (state: RootState) =>
  state.likedPosts.likedPostIds;
export const selectDisLikedPostIds = (state: RootState) =>
  state.likedPosts.dislikedPostIds;
export default likedPostsSlice.reducer;
