// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { SignalingChannel } from 'helpers/SignalingChannel';
import { generateQueryParam } from 'helpers/helpers';
import { Button } from '@material-ui/core';
import 'features/rtc/RTCPlayer.css';

const QUERY_PARAM_ROOM_NAME = 'room';

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
  }, []);

  return (
    <div className="player__container">
      <div><Button variant="contained" onClick={start} color="primary">Старт</Button></div>
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
