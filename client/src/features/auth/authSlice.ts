import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: any = {};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    getProfile(state, action: PayloadAction<any>) {
      return action.payload;
    },
    clearProfile() {
      return initialState;
    },
  },
});

export const { getProfile, clearProfile } = authSlice.actions;

export default authSlice.reducer;
