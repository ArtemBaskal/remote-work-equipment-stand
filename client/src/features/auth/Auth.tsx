import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { getProfile, clearProfile } from 'features/auth/authSlice';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Avatar } from '@material-ui/core';
import API_KEYS from 'API_KEYS.json';

function Auth() {
  const dispatch = useDispatch();
  const {
    imageUrl,
    email,
    name,
  } = useSelector((state: any) => state.auth, shallowEqual);

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
    <>
      {isAuthenticated && <Avatar alt={name} src={imageUrl} />}
      <div>{email}</div>
      <div>{name}</div>
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
    </>
  );
}

export default Auth;
