import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface userState {
  user: any;
  token: number;
}

const initialState: userState = {
  user: {},
  token: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    increment: (state, action) => {
      state.token += action.payload;
    },
    setTokenUser: (state, action) => {
      state.token += action.payload;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", action.payload.user);
    },
    removeTokenUser: (state, action) => {
      //   state.token = "";
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTokenUser, removeTokenUser, increment } = userSlice.actions;

export default userSlice.reducer;
