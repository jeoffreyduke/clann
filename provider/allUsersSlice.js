import { createSlice } from "@reduxjs/toolkit";

export const allUsersSlice = createSlice({
  name: "users",
  initialState: {
    value: {},
  },
  reducers: {
    handleAllUsers: (state, action) => {
      state.value = action.payload;
    },
    refreshAllUsers: (state, action) => {
      state.value = [];
    },
    updateUserReaction: (state, action) => {
      const { userId, reaction } = action.payload;
      state.value[userId].reaction = reaction;
      console.log(state.value);
    },
  },
});

export const { handleAllUsers, refreshAllUsers, updateUserReaction } =
  allUsersSlice.actions;

export default allUsersSlice.reducer;
