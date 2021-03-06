import React from 'react';
import { Alert } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { closeSnackbar } from 'features/snackbar/snackbarSlice';
import { RootState } from 'app/rootReducer';

const SNACKBAR_DELAY = 6000;

type IProps = {
    snackbarDelay?: number
};

export const SnackBar = ({ snackbarDelay }: IProps) => {
  const dispatch = useDispatch();

  const {
    open,
    snackbarMessage,
    type,
  } = useSelector((state: RootState) => state.snackbar, shallowEqual);

  const onCloseSnackbar = () => {
    dispatch(closeSnackbar());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={snackbarDelay}
      onClose={onCloseSnackbar}
      onClick={onCloseSnackbar}
    >
      <Alert severity={type}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
};

SnackBar.defaultProps = {
  snackbarDelay: SNACKBAR_DELAY,
};
