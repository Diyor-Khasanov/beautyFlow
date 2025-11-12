import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: localStorage.getItem("theme") || "dark",
  language: localStorage.getItem("language") || "uz",
};

export const settingSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", state.theme);
      document.documentElement.className = state.theme;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem("language", action.payload);
    },
  },
});

export const { toggleTheme, setLanguage } = settingSlice.actions;

export default settingSlice.reducer;
