import React from 'react';
import Auth from 'features/auth/Auth';
import RTCPlayer from 'features/rtc/RTCPlayer';
import LedIndicator from 'features/led/LedIndicator';
import { useSelector } from 'react-redux';
// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
import adapter from 'webrtc-adapter';

const App = () => {
  const name = useSelector((state: any) => state.auth.name);
  const isAuthenticated = !!name;

  return (
    <>
      <Auth />
      {isAuthenticated && (
      <>
        <RTCPlayer />
        <LedIndicator />
      </>
      )}
    </>
  );
};

export default App;
