import auth from 'features/auth/authSlice';
import fileLoader from 'features/fileLoader/fileLoaderSlice';
import led from 'features/led/ledSlice';
import snackbar from 'features/snackbar/snackbarSlice';
import webrtc from 'features/webrtc/webrtcSlice';
import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  auth,
  fileLoader,
  led,
  snackbar,
  webrtc,
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
