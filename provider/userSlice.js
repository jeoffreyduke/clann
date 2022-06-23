import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    value: {},
    auth: false,
  },
  reducers: {
    handleUser: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { handleUser } = userSlice.actions;

export default userSlice.reducer;
