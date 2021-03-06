/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const EMPTY_PROGRESS = 0;

const initialState = {
  maxProgress: EMPTY_PROGRESS,
  progressValue: EMPTY_PROGRESS,
};

const fileLoaderSlice = createSlice({
  name: 'fileLoader',
  initialState,
  reducers: {
    reset() {
      return initialState;
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
  setMaxProgress,
  setProgressValue,
} = fileLoaderSlice.actions;

export default fileLoaderSlice.reducer;
