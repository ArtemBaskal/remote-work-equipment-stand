import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GoogleLoginResponse } from 'react-google-login';

type AuthState = GoogleLoginResponse['profileObj'] & { id_token: string }

const initialState: AuthState = {
  googleId: '',
  imageUrl: '',
  email: '',
  name: '',
  givenName: '',
  familyName: '',
  id_token: '',
};

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
