import React, { useEffect, useRef, useState } from 'react';
import { SignalingChannel } from 'helpers/SignalingChannel';
import { generateQueryParam } from 'helpers/helpers';
import {
  FormControl,
  InputLabel,
  Select,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbarError, setSnackbarSuccess } from 'features/snackbar/snackbarSlice';
import { FileLoader } from 'features/fileLoader/FileLoader';
import {
  setPeerConnectionClose,
  setPeerConnectionOpen,
  setDataChannelClose,
} from 'features/webrtc/webrtcSlice';
import { Controls } from 'features/webrtc/Controls';
import { openDataChannel } from 'features/webrtc/helpers';
import { RootState } from 'app/rootReducer';
// @ts-ignore
import { RTCIceServer, MyRTCConfiguration } from 'webrtcTypes.d.ts';

const QUERY_PARAM_ROOM_NAME = 'room';

const configuration: MyRTCConfiguration = {
  iceServers: [
    { url: 'stun:stun.l.google.com:19302' },
    { url: 'stun:stun1.l.google.com:19302' },
    { url: 'stun:stun2.l.google.com:19302' },
    { url: 'stun:stun3.l.google.com:19302' },
    {
      urls: 'turn:numb.viagenie.ca',
      credential: '9u7prU:2}R{Sut~.)d[bP7,;Pgc\'Pa',
      username: 'fkrveacbukypqsqyaq@miucce.com',
    },
  ] as RTCIceServer[],
};

const NO_ROOM = '';
const polite = true;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    '& > *': {
      margin: theme.spacing(1),
    },
    padding: '2rem',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: '10rem',
  },
  video: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundImage: `url(${process.env.PUBLIC_URL}/chip.png)`,
    backgroundSize: '5.5rem',
    backgroundRepeat: 'space',
    width: '100%',
    minHeight: '30rem',
  },
}));

const RTCPlayer = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const id_token = useSelector((state: RootState) => state.auth.id_token);

  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31065#issuecomment-446425911
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);

  const [room, setRoom] = useState<string>(NO_ROOM);

  useEffect(() => {
    if (room === NO_ROOM) {
      return;
    }

    const roomQueryParam = generateQueryParam(QUERY_PARAM_ROOM_NAME, room);
    const baseURL = 'wss://wss-signaling.herokuapp.com';
    const url = new URL(`${roomQueryParam && `?${roomQueryParam}`}`, baseURL).toString();
    const ws = new WebSocket(url, ['id_token', id_token]);

    let signaling: SignalingChannel;
    const onCloseWS = (e: CloseEvent) => {
      console.log('CLOSE WS', e);
    };
    const onOpenWS = (e: Event) => {
      console.log('OPEN WS', e);
      signaling = new SignalingChannel(ws);
      signaling.send({ getRemoteMedia: true });

      const pc = new RTCPeerConnection(configuration);
      pcRef.current = pc;

      pc.ontrack = ({ track, streams: [stream] }) => {
        // once media for a remote track arrives, show it in the remote video element
        // eslint-disable-next-line no-param-reassign
        track.onunmute = () => {
          dispatch(setPeerConnectionOpen());
          dispatch(setSnackbarSuccess('Соединение установлено'));

          if (!dcRef.current) {
            console.log('opening data channel');
            openDataChannel({
              dcRef,
              pcRef,
              peerConnectionOpen: true,
              dataChannelOpen: false,
              dispatch,
            });
          } else {
            console.warn('data chanel is already opened');
          }

          // don't set srcObject again if it is already set.
          if (remoteVideoRef.current!.srcObject) {
            return;
          }
          remoteVideoRef.current!.srcObject = stream;
        };
      };

      // - The perfect negotiation logic, separated from the rest of the application ---

      // keep track of some negotiation state to prevent races and errors
      let makingOffer = false;
      let ignoreOffer = false;
      let isSettingRemoteAnswerPending = false;

      // send all ice candidates to the other peer
      pc.onicecandidate = ({ candidate }) => {
        signaling.send({ candidate });
      };

      // let the "negotiationneeded" event trigger offer generation
      pc.onnegotiationneeded = async () => {
        try {
          makingOffer = true;
          // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setLocalDescription#parameters
          // TODO fix on @types/webrtc update
          // @ts-ignore
          await pc.setLocalDescription();
          signaling.send({ description: pc.localDescription });
        } catch (err) {
          console.error(err);
        } finally {
          makingOffer = false;
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'failed') {
          pc.restartIce();
        }
      };

      signaling.onmessage = async ({ data, data: { description, candidate } }: ({
        data: {
          description: {
            type: RTCSessionDescription['type']
          },
          candidate: RTCIceCandidate,
        }
      })) => {
        // TODO add logger
        console.log(data);

        try {
          if (description) {
            // An offer may come in while we are busy processing SRD(answer).
            // In this case, we will be in "stable" by the time the offer is processed
            // so it is safe to chain it on our Operations Chain now.
            const readyForOffer = !makingOffer
                && (pc.signalingState === 'stable' || isSettingRemoteAnswerPending);
            const offerCollision = description.type === 'offer' && !readyForOffer;

            ignoreOffer = !polite && offerCollision;
            if (ignoreOffer) {
              return;
            }
            isSettingRemoteAnswerPending = description.type === 'answer';
            await pc.setRemoteDescription(description); // SRD rolls back as needed
            isSettingRemoteAnswerPending = false;
            if (description.type === 'offer') {
              // TODO fix on @types/webrtc update
              // @ts-ignore
              await pc.setLocalDescription();
              signaling.send({ description: pc.localDescription });
            }
          } else if (candidate) {
            try {
              await pc.addIceCandidate(candidate);
            } catch (err) {
              if (!ignoreOffer) {
                throw err;
              } // Suppress ignored offer's candidates
            }
          }
        } catch (err) {
          console.error(err);
        }
      };
    };
    const onErrorWS = (e: Event) => {
      console.error('ERROR WS', e);
      dispatch(setSnackbarError(`Не удалось присоединиться к стенду ${room}`));
    };

    ws.addEventListener('open', onOpenWS);
    ws.addEventListener('close', onCloseWS);
    ws.addEventListener('error', onErrorWS);

    // eslint-disable-next-line consistent-return
    return () => {
      ws.close(1000, 'change room');
      if (dcRef.current) {
        dcRef.current.close();
        dcRef.current = null;
        dispatch(setDataChannelClose());
      }
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
        dispatch(setPeerConnectionClose());
      }
      ws.removeEventListener('open', onOpenWS);
      ws.removeEventListener('close', onCloseWS);
      ws.removeEventListener('error', onErrorWS);
      if (signaling) {
        signaling.unsubscribe();
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    };
  }, [room]);

  useEffect(() => {
    const handler = async () => {
      if (document.visibilityState === 'visible' && document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }
    };

    document.addEventListener('visibilitychange', handler);
    return () => {
      document.removeEventListener('visibilitychange', handler);
    };
  }, []);

  const onChangeRoom = (e: React.ChangeEvent<{ value: unknown; }>) => {
    const { value } = e.target;
    if (typeof value !== 'string') {
      console.error('Room is not a string: ', value);
      return;
    }

    setRoom(value);
  };

  const togglePictureInPicture = async (e: React.MouseEvent<HTMLVideoElement>) => {
    if (!remoteVideoRef.current?.srcObject) {
      return;
    }

    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled) {
      await e.currentTarget.requestPictureInPicture();
    }
  };

  const id = 'outlined-room-native-simple';
  // TODO manage rooms from signaling server
  return (
    <div className={classes.root}>
      <FormControl variant="standard" className={classes.formControl}>
        <InputLabel htmlFor={id}>Стенд</InputLabel>
        <Select
          native
          value={room}
          onChange={onChangeRoom}
          label="Стенд"
          inputProps={{
            name: 'Стенд',
            id,
          }}
        >
          {Array.from(({ length: 5 }), (_, idx) => idx)
            .map((idx) => {
              const noRoom = idx === 0;
              const roomIdx = noRoom ? NO_ROOM : idx.toString();

              return (
                <option
                  key={roomIdx}
                  value={roomIdx}
                  disabled={noRoom}
                  aria-label={noRoom ? 'None' : roomIdx}
                >
                  {roomIdx}
                </option>
              );
            })}
        </Select>
      </FormControl>
      <section className={classes.video}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          onClick={togglePictureInPicture}
        />
      </section>
      <FileLoader pcRef={pcRef} />
      <Controls dcRef={dcRef} />
    </div>
  );
};

export default RTCPlayer;
