/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  peerConnectionOpen: false,
  dataChannelOpen: false,
};

const webrtcSlice = createSlice({
  name: 'webrtc',
  initialState,
  reducers: {
    reset() {
      return initialState;
    },
    setPeerConnectionClose(state) {
      state.peerConnectionOpen = false;
      return state;
    },
    setPeerConnectionOpen(state) {
      state.peerConnectionOpen = true;
      return state;
    },
    setDataChannelOpen(state) {
      state.dataChannelOpen = true;
      return state;
    },
    setDataChannelClose(state) {
      state.dataChannelOpen = false;
      return state;
    },
  },
});

export const {
  reset,
  setPeerConnectionClose,
  setPeerConnectionOpen,
  setDataChannelOpen,
  setDataChannelClose,
} = webrtcSlice.actions;

export default webrtcSlice.reducer;
