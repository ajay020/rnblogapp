// themesSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface ThemesState {
  darkMode: boolean;
}

const initialState: ThemesState = {
  darkMode: false,
};

const themesSlice = createSlice({
  name: "themes",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const { toggleDarkMode } = themesSlice.actions;
export const getDarkMode = (state: RootState) => state.themes.darkMode;
export default themesSlice.reducer;
