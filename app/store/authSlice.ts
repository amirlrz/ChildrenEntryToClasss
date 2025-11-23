'use client'

import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface AuthState {
  isSignUp: boolean;
}

const initialState: AuthState = {
  isSignUp: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setisSignUp: (state, action: PayloadAction<boolean>) => {
      state.isSignUp = action.payload; 
    }
  },
});


export const { setisSignUp } = authSlice.actions;
export default authSlice.reducer;
