import { combineReducers } from '@reduxjs/toolkit';

import auth from 'features/auth/authSlice';
import led from 'features/led/ledSlice';

const rootReducer = combineReducers({
  auth,
  led,
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
