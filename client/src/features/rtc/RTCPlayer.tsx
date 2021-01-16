// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { SignalingChannel } from 'helpers/SignalingChannel';
import { generateQueryParam } from 'helpers/helpers';
import 'features/rtc/RTCPlayer.css';

const QUERY_PARAM_ROOM_NAME = 'room';
const FILE_DATA_CHANNEL_BINARY_TYPE = 'arraybuffer';
const END_OF_FILE_MESSAGE = 'EOF';

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

const EMPTY_PROGRESS = 0;
const polite = true;

const RTCPlayer = () => {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const dataChannelFileSenderRef = useRef<HTMLInputElement>(null);
  const pcRef = useRef(null);

  const [maxProgress, setMaxProgress] = useState(EMPTY_PROGRESS);
  const [progressValue, setProgressValue] = useState(EMPTY_PROGRESS);

  useEffect(() => {
    const room = 1;
    const roomQueryParam = generateQueryParam(QUERY_PARAM_ROOM_NAME, room);
    const ws = new WebSocket(`wss://wss-signaling.herokuapp.com/${roomQueryParam && `?${roomQueryParam}`}`);

    const signaling = new SignalingChannel(ws);

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

    const onSendChannelStateChange = (e) => {
      const { readyState } = e.target;
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
  }, []);

  const onClick = () => {
    dataChannelFileSenderRef.current.click();
  };

  const onChange = (e) => {
    const [file] = e.target.files;
    const { name, size } = file;
    setMaxProgress(size);

    /*
          Label may not be longer than 65,535 bytes.
          https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel#parameters:~:text=channel.%20This%20string-,may%20not%20be%20longer%20than%2065%2C535%20bytes.
          Filename sizes may not exceed 255 bytes.
          https://www.ibm.com/support/knowledgecenter/SSEQVQ_8.1.10/client/c_cmd_filespecsyntax.html
      */
    const dataConstraint = null;
    /* TODO improve file transfering https://github.com/webrtc/samples/blob/gh-pages/src/content/datachannel/filetransfer/js/main.js */
    const sendFileChannel = pcRef.current.createDataChannel(name, dataConstraint);
    sendFileChannel.binaryType = FILE_DATA_CHANNEL_BINARY_TYPE;

    /*
    Firefox cannot send a message larger than 16 Kbytes to Chrome
    https://viblast.com/blog/2015/2/5/webrtc-data-channel-message-size/#blog-body:~:text=Firefox%20cannot%20send%20a%20message%20larger%20than%2016%20Kbytes%20to%20Chrome
    Messages smaller than 16kiB can be sent without concern,
    as all major user agents handle them the same way.
    Beyond that, things get more complicated.
    https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_data_channels#understanding_message_size_limits
    */

    const CHUNK_SIZE = 2 ** 14;

    const fileReader = new FileReader();
    let offset = 0;

    fileReader.addEventListener('error', (error) => {
      console.error('Error reading file: ', error);
    });

    fileReader.addEventListener('abort', (event) => {
      console.log('File reading aborted: ', event);
    });

    const readSlice = (byteOffset) => {
      console.log('readSlice', byteOffset);
      const slice = file.slice(offset, byteOffset + CHUNK_SIZE);
      fileReader.readAsArrayBuffer(slice);
    };

    fileReader.addEventListener('load', (e) => {
      console.log('FileReader.onload', e);
      sendFileChannel.send(e.target.result);

      if (offset < file.size) {
        readSlice(offset);
      } else {
        sendFileChannel.send(END_OF_FILE_MESSAGE);
      }
    });

    fileReader.addEventListener('progress', (e) => {
      offset += e.loaded;
      setProgressValue(offset);
    });

    fileReader.addEventListener('loadend', (e) => {
      console.log('loadend', e);
    });

    sendFileChannel.onopen = () => {
      const FIRST_BYTE_SLICE_NUMBER = 0;
      readSlice(FIRST_BYTE_SLICE_NUMBER);
    };
  };

  return (
    <div className="player__container">
      <hr />
      <section>
        <h3>Data channel file sender</h3>
        <input type="file" ref={dataChannelFileSenderRef} style={{ display: 'none' }} onChange={onChange} />
        <br />
        <button type="button" onClick={onClick}>Отправить файл</button>
        {progressValue > EMPTY_PROGRESS && <progress max={maxProgress} value={progressValue} />}
        <hr />
      </section>
      <h4>Удалённое видео</h4>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={remoteVideoRef} autoPlay playsInline />
    </div>
  );
};

export default RTCPlayer;
