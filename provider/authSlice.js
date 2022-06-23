import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    value: false,
  },
  reducers: {
    handleAuth: (state) => {
      state.value = true;
    },
    refreshAuth: (state) => {
      state.value = false;
    },
  },
});

export const { handleAuth, refreshAuth } = authSlice.actions;

export default authSlice.reducer;
