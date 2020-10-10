import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { getProfile, clearProfile } from 'features/auth/authSlice';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Toolbar,
} from '@material-ui/core';
import API_KEYS from 'API_KEYS.json';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}));

const Auth = () => {
  const dispatch = useDispatch();
  const {
    imageUrl,
    email,
    name,
  } = useSelector((state: any) => state.auth, shallowEqual);
  const classes = useStyles();

  const isAuthenticated = !!name;

  const onSuccess = (response: any) => {
    dispatch(getProfile(response.profileObj));
  };

  const onFailure = (e: any) => {
    console.error(e);
  };

  const onLogoutSuccess = () => {
    dispatch(clearProfile());
  };

  return (
    <Toolbar>
      <div className={classes.root}>
        <List>
          <ListItem>
            {name && (
            <ListItemAvatar>
              <Avatar>
                <Avatar alt={name} src={imageUrl} />
              </Avatar>
            </ListItemAvatar>
            )}
            <ListItemText
              primary={name}
              secondary={email}
            />
            <ListItemSecondaryAction>
              {isAuthenticated ? (
                <GoogleLogout
                  clientId={API_KEYS.GOOGLE_AUTH}
                  buttonText="Выйти"
                  onLogoutSuccess={onLogoutSuccess}
                />
              ) : (
                <GoogleLogin
                  clientId={API_KEYS.GOOGLE_AUTH}
                  buttonText="Войти"
                  onSuccess={onSuccess}
                  onFailure={onFailure}
                  cookiePolicy="single_host_origin"
                  isSignedIn
                />
              )}
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </div>
    </Toolbar>
  );
};

export default Auth;
