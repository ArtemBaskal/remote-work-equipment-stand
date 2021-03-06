/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Color } from '@material-ui/lab/Alert/Alert';

const initialState = {
  snackbarMessage: '',
  type: 'info' as Color,
  open: false,
};

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    reset() {
      return initialState;
    },
    setSnackbarSuccess(state, action: PayloadAction<string>) {
      state.snackbarMessage = action.payload;
      state.type = 'success';
      state.open = true;
      return state;
    },
    setSnackbarError(state, action: PayloadAction<string>) {
      state.snackbarMessage = action.payload;
      state.type = 'error';
      state.open = true;
      return state;
    },
    closeSnackbar(state) {
      // State of snackbar is not reset on snackbar close in order to perform close animation
      state.open = false;
      return state;
    },
  },
});

export const {
  reset,
  setSnackbarSuccess,
  setSnackbarError,
  closeSnackbar,
} = snackbarSlice.actions;

export default snackbarSlice.reducer;
