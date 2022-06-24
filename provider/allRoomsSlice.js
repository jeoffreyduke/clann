import { createSlice } from "@reduxjs/toolkit";

export const allRoomsSlice = createSlice({
  name: "rooms",
  initialState: {
    value: [],
  },
  reducers: {
    handleAllRooms: (state, action) => {
      state.value = action.payload;
    },
    refreshAllRooms: (state) => {
      state.value = [];
    },
  },
});

export const { handleAllRooms, refreshAllRooms } = allRoomsSlice.actions;

export default allRoomsSlice.reducer;
