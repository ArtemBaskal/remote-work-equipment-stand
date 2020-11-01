import React, { useEffect, useRef } from 'react';
import { CardMedia } from '@material-ui/core';
import 'features/rtc/RTCPlayer.css';

const constraints = { audio: false, video: { width: 640, height: 360 } };

const RTCPlayer = () => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia(constraints)
      .then((mediaStream) => {
        ref.current!.srcObject = mediaStream;
      });
  }, []);

  const onLoadedMetadata = () => ref.current!.play();

  return (
    <div className="player__container">
      <CardMedia
        component="video"
        height={constraints.video.height}
        width={constraints.video.width}
        title="stream"
        onLoadedMetadata={onLoadedMetadata}
        ref={ref}
        muted
      />
    </div>
  );
};

export default RTCPlayer;
