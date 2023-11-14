// userSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAuth, User } from "firebase/auth";

import { UpdateProfilePayload } from "../types/types";
import { updateUserProfile } from "../utils/firebaseUtils";

interface UserData extends User {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
}

interface UserState {
  user: Partial<UserData> | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  loadingUser: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: "idle",
  loadingUser: false,
  error: null,
};

export const updateProfileAsync = createAsyncThunk(
  "user/updateProfile",
  async (payload: UpdateProfilePayload) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      await updateUserProfile(payload, user);
      const updatedUser = auth.currentUser;
      return {
        uid: updatedUser.uid,
        name: updatedUser.displayName,
        email: updatedUser.email,
        photoURL: updatedUser.photoURL,
      };
    } else {
      throw new Error("User not authenticated.");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // setUser: (state, action: PayloadAction<UserData | null>) => {
    //   state.user = action.payload;
    // },
    // updateUserStart: (state) => {
    //   state.status = "loading";
    // },
    // updateUserSuccess: (state, action: PayloadAction<UserData>) => {
    //   state.status = "succeeded";
    //   state.user = action.payload;
    // },
    // updateUserFailure: (state, action: PayloadAction<string>) => {
    //   state.status = "failed";
    //   state.error = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfileAsync.pending, (state) => {
        state.status = "loading";
        state.loadingUser = true;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.loadingUser = false;
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.status = "failed";
        state.loadingUser = false;
        state.error = action.error.message || "Failed profile update";
      });
  },
});

// export const {
//   setUser,
//   updateUserStart,
//   updateUserSuccess,
//   updateUserFailure,
// } = userSlice.actions;

export default userSlice.reducer;
