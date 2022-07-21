import { createSlice } from "@reduxjs/toolkit";

export const countSlice = createSlice({
  name: "count",
  initialState: {
    value: 0,
  },
  reducers: {
    handleCount: (state, action) => {
      state.value = action.payload;
    },
    refreshCount: (state) => {
      state.value = null;
    },
  },
});

export const { handleCount, refreshCount } = countSlice.actions;

export default countSlice.reducer;
