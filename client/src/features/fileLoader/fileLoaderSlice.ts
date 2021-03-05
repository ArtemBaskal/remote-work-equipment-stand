/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const EMPTY_PROGRESS = 0;

const initialState = {
  maxProgress: EMPTY_PROGRESS,
  progressValue: EMPTY_PROGRESS,
  snackbarSuccess: '',
  snackbarError: '',
};

export type FileLoaderType = typeof initialState;

const fileLoaderSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset() {
      return initialState;
    },
    setSnackbarSuccess(state, action: PayloadAction<string>) {
      state.snackbarSuccess = action.payload;
      return state;
    },
    setSnackbarError(state, action: PayloadAction<string>) {
      state.snackbarError = action.payload;
      return state;
    },
    closeSuccessSnackbar(state) {
      state.snackbarSuccess = initialState.snackbarSuccess;
      return state;
    },
    closeErrorSnackbar(state) {
      state.snackbarError = initialState.snackbarError;
      return state;
    },
    setMaxProgress(state, action: PayloadAction<number>) {
      state.maxProgress = action.payload;
      return state;
    },
    setProgressValue(state, action: PayloadAction<number>) {
      state.progressValue = action.payload;
      return state;
    },
  },
});

export const {
  reset,
  setSnackbarSuccess,
  setSnackbarError,
  closeSuccessSnackbar,
  closeErrorSnackbar,
  setMaxProgress,
  setProgressValue,
} = fileLoaderSlice.actions;

export default fileLoaderSlice.reducer;
