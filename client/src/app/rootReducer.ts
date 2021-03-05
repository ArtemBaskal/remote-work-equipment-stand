import { combineReducers } from '@reduxjs/toolkit';

import auth from 'features/auth/authSlice';
import led from 'features/led/ledSlice';
import fileLoader from 'features/fileLoader/fileLoaderSlice';

const rootReducer = combineReducers({
  auth,
  led,
  fileLoader,
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
