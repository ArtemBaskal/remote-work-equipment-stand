import React from 'react';
import RTCPlayer from 'features/rtc/RTCPlayer';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Avatar,
  ListItemText,
  Toolbar,
} from '@material-ui/core';
import { GoogleLogout } from 'react-google-login';
import { SnackBar } from 'features/snackbar/SnackBar';

import API_KEYS from 'API_KEYS.json';
import CssBaseline from '@material-ui/core/CssBaseline';
// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
import adapter from 'webrtc-adapter';
import { clearProfile } from '../features/auth/authSlice';
import Auth from '../features/auth/Auth';

declare global {
  export interface Document {
    pictureInPictureElement: Element
    exitPictureInPicture: () => Promise<any>
    pictureInPictureEnabled: boolean
  }
  export interface HTMLVideoElement {
    requestPictureInPicture: () => Promise<any>;
  }
}

const App = () => {
  const dispatch = useDispatch();
  const {
    imageUrl,
    email,
    name,
  } = useSelector((state: any) => state.auth, shallowEqual);

  const isAuthenticated = !!name;

  const onLogoutSuccess = () => {
    dispatch(clearProfile());
  };

  return (
    <>
      <CssBaseline />
      <SnackBar />
      {isAuthenticated ? (
        <>
          <Paper elevation={1} variant="outlined" square>
            <Toolbar>
              <Box mr={1}>
                <Avatar alt={name} src={imageUrl} />
              </Box>
              <ListItemText
                primary={name}
                secondary={email}
              />
              <GoogleLogout
                clientId={API_KEYS.GOOGLE_AUTH}
                buttonText="Выйти"
                onLogoutSuccess={onLogoutSuccess}
              />
            </Toolbar>
          </Paper>
          <Box m={2}>
            <Paper elevation={3} variant="outlined">
              <RTCPlayer />
              {/* FIXME <LedIndicator /> */}
            </Paper>
          </Box>
        </>
      )
        : <Auth />}
    </>
  );
};

export default App;
