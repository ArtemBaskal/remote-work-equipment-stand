// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { SignalingChannel } from 'helpers/SignalingChannel';
import { generateQueryParam } from 'helpers/helpers';
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbarError } from 'features/snackbar/snackbarSlice';
import { FileLoader } from 'features/fileLoader/FileLoader';
import { RootState } from 'app/rootReducer';

const QUERY_PARAM_ROOM_NAME = 'room';

const configuration = {
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
  ],
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

const MESSAGES_CHANNEL_NAME = 'sendDataChannel';

const RTCPlayer = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const id_token = useSelector((state: RootState) => state.auth.id_token);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef(null);
  const dcRef = useRef(null);

  const [inputValue, setInputValue] = useState('');
  const [isDataChannelOpened, setDataChannelOpened] = useState(false);

  const onInputChange = (e) => {
    // TODO add snackbar feedback
    if (!dcRef.current) {
      const dataConstraint = null;
      dcRef.current = pcRef.current.createDataChannel(MESSAGES_CHANNEL_NAME, dataConstraint);
      const dataChannel = dcRef.current;
      dataChannel.onopen = () => {
        setDataChannelOpened(true);
      };
      dataChannel.onclose = () => {
        setDataChannelOpened(false);
      };
    }

    setInputValue(e.target.value);
  };

  const onSend = () => {
    if (dcRef.current && isDataChannelOpened) {
      dcRef.current.send(inputValue);
      setInputValue('');
    }
  };

  const [room, setRoom] = useState<string>(NO_ROOM);

  useEffect(() => {
    if (room === NO_ROOM) {
      return;
    }

    const roomQueryParam = generateQueryParam(QUERY_PARAM_ROOM_NAME, room);
    const baseURL = 'wss://wss-signaling.herokuapp.com';
    const url = new URL(`${roomQueryParam && `?${roomQueryParam}`}`, baseURL).toString();
    const ws = new WebSocket(url, ['id_token', id_token]);

    let signaling;
    const onCloseWS = (e) => {
      console.log('CLOSE WS', e);
    };
    const onOpenWS = (e) => {
      console.log('OPEN WS', e);
      signaling = new SignalingChannel(ws);
      signaling.send({ getRemoteMedia: true });

      const pc = new RTCPeerConnection(configuration);
      pcRef.current = pc;

      pc.ontrack = ({ track, streams: [stream] }) => {
        // once media for a remote track arrives, show it in the remote video element
        // eslint-disable-next-line no-param-reassign
        track.onunmute = () => {
          // don't set srcObject again if it is already set.
          if (remoteVideoRef.current.srcObject) {
            return;
          }
          remoteVideoRef.current.srcObject = stream;
        };
      };

      // - The perfect negotiation logic, separated from the rest of the application ---

      // keep track of some negotiation state to prevent races and errors
      let makingOffer = false;
      let ignoreOffer = false;
      let isSettingRemoteAnswerPending = false;

      // send any ice candidates to the other peer
      pc.onicecandidate = ({ candidate }) => {
        signaling.send({ candidate });
      };

      // let the "negotiationneeded" event trigger offer generation
      pc.onnegotiationneeded = async () => {
        try {
          makingOffer = true;
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

      signaling.onmessage = async ({ data, data: { description, candidate } }) => {
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

      const onSendChannelStateChange = ({ target: { readyState } }) => {
        console.log('Send channel state is: %s', readyState);
      };

      /* TODO remove as far as we do not accept any messages */
      pc.addEventListener('datachannel', ({ channel }) => {
        channel.addEventListener('message', (event) => {
          console.log('Received Message: %s', event.data);
        });
        channel.addEventListener('open', onSendChannelStateChange);
        channel.addEventListener('close', onSendChannelStateChange);
      });
    };
    const onErrorWS = (e) => {
      console.error('ERROR WS', e);
      dispatch(setSnackbarError(`Не удалось присоединиться к стенду ${room}`));
    };

    ws.addEventListener('open', onOpenWS);
    ws.addEventListener('close', onCloseWS);
    ws.addEventListener('error', onErrorWS);

    // eslint-disable-next-line consistent-return
    return () => {
      ws.close(1000, 'change room');
      if (pcRef.current) {
        pcRef.current.close();
      }
      ws.removeEventListener('open', onOpenWS);
      if (signaling) {
        signaling.unsubscribe();
      }
      remoteVideoRef.current.srcObject = null;
    };
  }, [room]);

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === 'visible' && document.pictureInPictureElement) {
        document.exitPictureInPicture();
      }
    };

    document.addEventListener('visibilitychange', handler);
    return () => {
      document.removeEventListener('visibilitychange', handler);
    };
  }, []);

  const onChangeRoom = (e) => {
    setRoom(e.target.value);
  };

  const togglePictureInPicture = (e) => {
    if (!remoteVideoRef.current?.srcObject) {
      return;
    }

    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled) {
      e.target.requestPictureInPicture();
    }
  };

  return (
    <div className={classes.root}>
      <FormControl variant="standard" className={classes.formControl}>
        <InputLabel htmlFor="outlined-room-native-simple">Стенд</InputLabel>
        <Select
          native
          value={room}
          onChange={onChangeRoom}
          label="Стенда"
          inputProps={{
            name: 'Стенд',
            id: 'outlined-room-native-simple',
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
      <section>
        <TextField
          multiline
          value={inputValue}
          onChange={onInputChange}
        />
        <br />
        <br />
        <Button
          component="button"
          color="primary"
          onClick={onSend}
          variant="contained"
          type="submit"
          size="small"
          disabled={!isDataChannelOpened}
        >
          Отправить команду
        </Button>
      </section>
    </div>
  );
};

export default RTCPlayer;
