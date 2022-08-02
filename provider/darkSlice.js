import { createSlice } from "@reduxjs/toolkit";

export const darkSlice = createSlice({
  name: "dark",
  initialState: {
    value: "",
  },
  reducers: {
    handleBgSwitch: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { handleBgSwitch } = darkSlice.actions;

export default darkSlice.reducer;
