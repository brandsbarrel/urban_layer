import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: false, // mobile drawer state
  darkMode: false, // UI toggle only; dark theme values are not defined in the source design
  searchQuery: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
});

export const { toggleSidebar, closeSidebar, toggleDarkMode, setSearchQuery } =
  uiSlice.actions;
export default uiSlice.reducer;