import React, { useState } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbarError, setSnackbarSuccess } from '../snackbar/snackbarSlice';
import { setDataChannelClose, setDataChannelOpen } from './webrtcSlice';
import { RootState } from '../../app/rootReducer';

const MESSAGES_CHANNEL_NAME = 'sendDataChannel';

type IProps = {
    /* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["dcRef"] }] */
    dcRef: React.MutableRefObject<RTCDataChannel | null>,
    pcRef: React.MutableRefObject<RTCPeerConnection | null>
};

export const Controls = ({ dcRef, pcRef }: IProps) => {
  const dispatch = useDispatch();
  const peerConnectionOpen = useSelector((state: RootState) => state.webrtc.peerConnectionOpen);
  const dataChannelOpen = useSelector((state: RootState) => state.webrtc.dataChannelOpen);
  const [inputValue, setInputValue] = useState('');

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!peerConnectionOpen) {
      dispatch(setSnackbarError('Не установлено соединение со стендом'));
      return;
    }

    if (!pcRef.current) {
      console.error('RTCPeerConnection ref:', pcRef.current);
      return;
    }

    if (!dataChannelOpen) {
      dcRef.current = pcRef.current.createDataChannel(MESSAGES_CHANNEL_NAME);
      dcRef.current.onopen = () => {
        dispatch(setDataChannelOpen());
      };
      dcRef.current.onclose = () => {
        dispatch(setDataChannelClose());
      };
    }

    setInputValue(e.target.value);
  };

  const onSend = () => {
    if (dcRef.current && dataChannelOpen) {
      dcRef.current.send(inputValue);
      dispatch(setSnackbarSuccess('Команда отправлена'));
      setInputValue('');
    }
  };

  return (
    <section>
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
          <TextField
            label="Команда"
            multiline
            value={inputValue}
            onChange={onInputChange}
            disabled={!peerConnectionOpen}
          />
        </Grid>
        <Grid item>
          <Button
            component="button"
            color="primary"
            onClick={onSend}
            variant="text"
            type="submit"
            size="small"
            disabled={!dataChannelOpen || !inputValue?.trim()}
            endIcon={<SendIcon />}
          >
            Отправить
          </Button>
        </Grid>
      </Grid>
    </section>
  );
};
