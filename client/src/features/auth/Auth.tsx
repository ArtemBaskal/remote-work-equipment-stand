import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { getProfile } from 'features/auth/authSlice';
import { useDispatch } from 'react-redux';
import API_KEYS from 'API_KEYS.json';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(350 + theme.spacing(2) * 2)]: {
      width: 350,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    height: 190,
    [theme.breakpoints.up(350 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  button: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
  },
}));

const Auth = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const onSuccess = (response: any) => {
    dispatch(getProfile({ ...response.profileObj, id_token: response.tokenObj.id_token }));
  };

  const onFailure = (e: any) => {
    console.error(e);
  };

  return (
    <main className={classes.layout}>
      <Paper className={classes.paper} variant="outlined" square>
        <Typography component="h5" variant="h5" align="center">
          Авторизация
        </Typography>
        <div className={classes.button}>
          <GoogleLogin
            clientId={API_KEYS.GOOGLE_AUTH}
            buttonText="Войти"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy="single_host_origin"
            isSignedIn
          />
        </div>
      </Paper>
    </main>
  );
};

export default Auth;
