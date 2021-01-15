// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { SignalingChannel } from 'helpers/SignalingChannel';
import { generateQueryParam } from 'helpers/helpers';
import { Button } from '@material-ui/core';
import 'features/rtc/RTCPlayer.css';

const QUERY_PARAM_ROOM_NAME = 'room';
const FILE_DATA_CHANNEL_BINARY_TYPE = 'arraybuffer';
const MESSAGES_CHANNEL_NAME = 'sendDataChannel';
const END_OF_FILE_MESSAGE = 'EOF';

const constraints = { audio: true, video: true };
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
let polite = true;

const RTCPlayer = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef(null);

  const start = async () => {
    polite = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      stream.getTracks().forEach((track) => {
        pcRef.current.addTrack(track, stream);
      });

      localVideoRef.current.srcObject = stream;
    } catch (err) {
      console.error(err);
    }
  };

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

    let chatChannel;
    const createChatChannel = () => {
      if (chatChannel) {
        return;
      }

      const dataConstraint = null;
      chatChannel = pc.createDataChannel(MESSAGES_CHANNEL_NAME, dataConstraint);
      chatChannel.addEventListener('open', onSendChannelStateChange);
      chatChannel.addEventListener('close', onSendChannelStateChange);
      dataChannelSenderBtn.addEventListener('click', () => {
        chatChannel.send(dataChannelSender.value);
      });
    };

    dataChannelSender.addEventListener('focus', createChatChannel);

    dataChannelFileSenderBtn.addEventListener('click', () => {
      dataChannelFileSender.click();
    });

    dataChannelFileSender.addEventListener('change', (e) => {
      const [file] = e.target.files;
      const { name, size } = file;
      sendProgress.max = size;

      /*
            Label may not be longer than 65,535 bytes.
            https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel#parameters:~:text=channel.%20This%20string-,may%20not%20be%20longer%20than%2065%2C535%20bytes.
            Filename sizes may not exceed 255 bytes.
            https://www.ibm.com/support/knowledgecenter/SSEQVQ_8.1.10/client/c_cmd_filespecsyntax.html
            */
      const dataConstraint = null;
      const sendFileChannel = pc.createDataChannel(name, dataConstraint);
      sendFileChannel.binaryType = FILE_DATA_CHANNEL_BINARY_TYPE;
      /*
             Firefox cannot send a message larger than 16 Kbytes to Chrome
             https://viblast.com/blog/2015/2/5/webrtc-data-channel-message-size/#blog-body:~:text=Firefox%20cannot%20send%20a%20message%20larger%20than%2016%20Kbytes%20to%20Chrome
             Messages smaller than 16kiB can be sent without concern, as all major user agents handle them the same way. Beyond that, things get more complicated.
             https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_data_channels#understanding_message_size_limits:~:text=Messages%20smaller%20than%2016kiB%20can%20be,Beyond%20that%2C%20things%20get%20more%20complicated.
            */
      const CHUNK_SIZE = 2 ** 14;
      const FIRST_SLICE_BYTE = 0;

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

        offset += e.target.result.byteLength;
        sendProgress.value = offset;

        if (offset < file.size) {
          readSlice(offset);
        } else {
          sendFileChannel.send(END_OF_FILE_MESSAGE);
        }
      });

      readSlice(FIRST_SLICE_BYTE);
    });

    pc.addEventListener('datachannel', ({ channel }) => {
      console.log('Receive Channel Callback');

      if (channel.label === MESSAGES_CHANNEL_NAME) {
        channel.addEventListener('message', (event) => {
          console.log('Received Message: %s', event.data);
          sendDataChannelReceiver.value = event.data;
        });
      } else {
        const fileName = channel.label;
        let receivedFileBuffer = [];

        channel.binaryType = FILE_DATA_CHANNEL_BINARY_TYPE;

        channel.addEventListener('message', (event) => {
          if (event.data === END_OF_FILE_MESSAGE) {
            /* FIXME does this understand type application/sdp? */
            const receivedFile = new Blob(receivedFileBuffer/* {type: 'application/sdp'} */);
            receivedFileBuffer = [];

            const a = dataChannelFileDownloadLink;
            const url = URL.createObjectURL(receivedFile);
            a.href = url;
            a.download = fileName;
            a.textContent = `Click to download ${fileName} (${receivedFile.size} bytes)`;
            // a.click();
            // URL.revokeObjectURL(url);
            // a.remove()
            channel.close();
          } else {
            receivedFileBuffer.push(event.data);
          }
        });
      }
      channel.addEventListener('open', onSendChannelStateChange);
      channel.addEventListener('close', onSendChannelStateChange);
    });
  }, []);

  return (
    <div className="player__container">
      <div><Button variant="contained" onClick={start} color="primary">Старт</Button></div>
      <hr />
      <section>
        <h3>Data channel text sender</h3>
        <textarea id="dataChannelSender" />
        <br />
        <button type="button" id="dataChannelSenderBtn">Отправить сообщение</button>
        <h3>Data channel text receiver (readonly)</h3>
        <textarea id="sendDataChannelReceiver" readOnly />
        <hr />
        <h3>Data channel file sender</h3>
        <input type="file" id="dataChannelFileSender" style={{ display: 'none' }} />
        <br />
        <button type="button" id="dataChannelFileSenderBtn">Отправить файл</button>
        <progress id="sendProgress" max="0" value="0" />
        <h3>Data channel file receiver (readonly)</h3>
        <a id="dataChannelFileDownloadLink">Download link</a>
        <hr />
      </section>
      <h4>Локальное видео</h4>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={localVideoRef} autoPlay playsInline />
      <hr />
      <h4>Удалённое видео</h4>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={remoteVideoRef} autoPlay playsInline />
    </div>
  );
};

export default RTCPlayer;
