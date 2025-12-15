import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitialStateTypes {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;

  // ⭐ NEW FIELD FOR SEARCH
  searchQuery: string;
}

const initialState: InitialStateTypes = {
  isSidebarCollapsed: false,
  isDarkMode: false,

  // ⭐ NEW
  searchQuery: "",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },

    // ⭐ NEW ACTION FOR UPDATING SEARCH TEXT
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { 
  setIsSidebarCollapsed, 
  setIsDarkMode,
  setSearchQuery,        // ⭐ EXPORT NEW ACTION
} = globalSlice.actions;

export default globalSlice.reducer;
