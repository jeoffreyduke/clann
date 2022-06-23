import { createSlice } from "@reduxjs/toolkit";

export const allUsersSlice = createSlice({
  name: "users",
  initialState: {
    value: [],
  },
  reducers: {
    handleAllUsers: (state, action) => {
      state.value = action.payload;
    },
    refreshAllUsers: (state, action) => {
      state.value = [];
    },
  },
});

export const { handleAllUsers, refreshAllUsers } = allUsersSlice.actions;

export default allUsersSlice.reducer;
