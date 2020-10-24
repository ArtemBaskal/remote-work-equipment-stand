import React, { useEffect } from 'react';
import Auth from 'features/auth/Auth';
import FileUploader from 'components/FileUploader';
import { useSelector } from 'react-redux';

const App = () => {
  const name = useSelector((state: any) => state.auth.name);
  const isAuthenticated = !!name;

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/ws');

    ws.onopen = () => {
      console.log('WS connected');
      ws.send('Ping from client');
    };

    ws.onclose = (event: CloseEvent) => {
      console.log('WS closed connection', event);
    };

    ws.onerror = (error) => {
      console.log('WS error', error);
    };
  }, []);

  return (
    <>
      <Auth />
      {isAuthenticated && <FileUploader />}
    </>
  );
};

export default App;
