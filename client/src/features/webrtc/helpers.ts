import React, { Dispatch } from 'react';
import { setSnackbarError } from '../snackbar/snackbarSlice';
import { setDataChannelClose, setDataChannelOpen } from './webrtcSlice';

const MESSAGES_CHANNEL_NAME = 'sendDataChannel';

type OpenDCProps = {
    /* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["dcRef"] }] */
    dcRef: React.MutableRefObject<RTCDataChannel | null>,
    pcRef: React.MutableRefObject<RTCPeerConnection | null>
    dataChannelOpen: boolean,
    peerConnectionOpen: boolean,
    dispatch: Dispatch<any>,
    dataChannelName?: string
}

export const openDataChannel = ({
  dcRef,
  pcRef,
  peerConnectionOpen,
  dataChannelOpen,
  dispatch,
  dataChannelName = MESSAGES_CHANNEL_NAME,
}: OpenDCProps) => {
  if (!peerConnectionOpen) {
    dispatch(setSnackbarError('Не установлено соединение со стендом'));
    return;
  }

  if (!pcRef.current) {
    console.error('RTCPeerConnection ref:', pcRef.current);
    return;
  }

  if (!dataChannelOpen) {
    dcRef.current = pcRef.current.createDataChannel(dataChannelName);
    const onOpen = () => {
      dispatch(setDataChannelOpen());
    };

    const onClose = () => {
      dispatch(setDataChannelClose());
    };

    dcRef.current.addEventListener('open', onOpen);
    dcRef.current.addEventListener('close', onClose);

    const clean = () => {
      dcRef?.current?.removeEventListener('open', onOpen);
      dcRef?.current?.removeEventListener('close', onClose);
    };

    // eslint-disable-next-line consistent-return
    return clean;
  }
};
