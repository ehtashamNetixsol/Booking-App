import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface userState {
  token: number;
}

const initialState: userState = {
  token: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    incrementt: (state, action) => {
      state.token += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { incrementt } = counterSlice.actions;

export default counterSlice.reducer;
