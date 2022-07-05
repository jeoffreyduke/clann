import { createSlice } from "@reduxjs/toolkit";

export const roomSlice = createSlice({
  name: "room",
  initialState: {
    value: {},
  },
  reducers: {
    handleRoom: (state, action) => {
      state.value = action.payload;
    },
    updateAbout: (state, action) => {
      state.value.about = action.payload;
    },
  },
});

export const { handleRoom, updateAbout } = roomSlice.actions;

export default roomSlice.reducer;
