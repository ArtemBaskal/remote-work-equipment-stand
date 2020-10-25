import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Led = {
  pin1: boolean,
  pin2: boolean,
  pin3: boolean,
}

const initialState: Led = {
  pin1: false,
  pin2: false,
  pin3: false,
};

const ledSlice = createSlice({
  name: 'led',
  initialState,
  reducers: {
    setLed(state, action: PayloadAction<Led>) {
      return action.payload;
    },
  },
});

export const { setLed } = ledSlice.actions;

export default ledSlice.reducer;
