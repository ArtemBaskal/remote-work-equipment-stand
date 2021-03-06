import auth from 'features/auth/authSlice';
import fileLoader from 'features/fileLoader/fileLoaderSlice';
import led from 'features/led/ledSlice';
import snackbar from 'features/snackbar/snackbarSlice';
import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  auth,
  fileLoader,
  led,
  snackbar,
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
