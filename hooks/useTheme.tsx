import { useSelector } from "react-redux";

import { darkThemeColors, lightThemeColors } from "../src/utils/themeColors";
import { RootState } from "../src/redux/store";

export const useTheme = () => {
  const darkMode = useSelector((state: RootState) => state.themes.darkMode);
  const themeColors = darkMode ? darkThemeColors : lightThemeColors;

  return {
    darkMode,
    themeColors,
  };
};
