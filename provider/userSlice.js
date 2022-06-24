import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    value: {},
  },
  reducers: {
    handleUser: (state, action) => {
      state.value = action.payload;
    },
    refreshUser: (state) => {
      state.value = {};
    },
  },
});

export const { handleUser, refreshUser } = userSlice.actions;

export default userSlice.reducer;
