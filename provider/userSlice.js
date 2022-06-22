import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "users",
  initialState: {
    value: {},
  },
  reducers: {
    handleUser: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { handleUser } = userSlice.actions;

export default userSlice.reducer;
