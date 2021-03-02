import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthState = {
    googleId: string,
    imageUrl: string,
    email: string,
    name: string,
    givenName: string,
    familyName: string,
    id_token: string,
}

const initialState = {};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    getProfile(state, action: PayloadAction<AuthState>) {
      return action.payload;
    },
    clearProfile() {
      return initialState;
    },
  },
});

export const { getProfile, clearProfile } = authSlice.actions;

export default authSlice.reducer;
