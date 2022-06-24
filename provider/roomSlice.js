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
  },
});

export const { handleRoom } = roomSlice.actions;

export default roomSlice.reducer;
