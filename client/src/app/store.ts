import { configureStore, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';

import rootReducer, { RootState } from 'app/rootReducer';
import { Led } from 'features/led/ledSlice';
import { AuthState } from 'features/auth/authSlice';
import { FileLoaderType } from 'features/fileLoader/fileLoaderSlice';

const store = configureStore({
  reducer: rootReducer,
});

// @ts-ignore
if (process.env.NODE_ENV === 'development' && module.hot) {
  // @ts-ignore
  module.hot.accept('./rootReducer', () => {
    // eslint-disable-next-line global-require
    const newRootReducer = require('./rootReducer').default;
    store.replaceReducer(newRootReducer);
  });
}

export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
export type AppStore = { led: Led, auth: AuthState, fileLoader: FileLoaderType };

export default store;
