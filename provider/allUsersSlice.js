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
    },
    updateUserNotifications: (state, action) => {
      const { userId, notifications } = action.payload;
      state.value[userId].notifications = notifications;
    },
  },
});

export const {
  handleAllUsers,
  refreshAllUsers,
  updateUserReaction,
  updateUserNotifications,
} = allUsersSlice.actions;

export default allUsersSlice.reducer;
