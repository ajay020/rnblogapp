import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch as useReduxDispatch } from "react-redux";

import postReducer from "./postSlice";
import userReducer from "./userSlice";
import likedPostsReducer from "./likedPostSlice";
import themesReducer from "./themeSlice";

const rootReducer = combineReducers({
  posts: postReducer,
  user: userReducer,
  likedPosts: likedPostsReducer,
  themes: themesReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use a custom useDispatch to enforce the correct types
export const useDispatch = () => useReduxDispatch<AppDispatch>();

export default store;
