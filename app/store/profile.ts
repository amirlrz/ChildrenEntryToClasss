"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
  name: string;
  age: number | null;
}

const initialState: ProfileState = {
  name: "",
  age: null,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileState>) => {
      state.name = action.payload.name;
      state.age = action.payload.age;
    },
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
