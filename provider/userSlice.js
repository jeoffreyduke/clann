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
    updateName: (state, action) => {
      state.value.name = action.payload;
    },
    updateBio: (state, action) => {
      state.value.bio = action.payload;
    },
    updateDP: (state, action) => {
      state.value.profile_pic = action.payload;
    },
    updateCover: (state, action) => {
      state.value.cover_photo = action.payload;
    },
    updateReaction: (state, action) => {
      state.value.reaction = action.payload;
    },
    updateNotifications: (state, action) => {
      state.value.notifications = action.payload;
    },
    updateFavorites: (state, action) => {
      state.value.favorites = action.payload;
    },
    refreshFavorite: (state) => {
      state.value.favorites = {};
    },
  },
});

export const {
  handleUser,
  refreshUser,
  updateName,
  updateBio,
  updateCover,
  updateDP,
  updateReaction,
  updateNotifications,
  updateFavorites,
  refreshFavorite,
} = userSlice.actions;

export default userSlice.reducer;
