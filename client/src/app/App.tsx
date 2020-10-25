import React from 'react';
import Auth from 'features/auth/Auth';
import FileUploader from 'components/FileUploader';
import LedIndicator from 'features/led/LedIndicator';
import { useSelector } from 'react-redux';

const App = () => {
  const name = useSelector((state: any) => state.auth.name);
  const isAuthenticated = !!name;

  return (
    <>
      <Auth />
      {isAuthenticated && (
      <>
        <FileUploader />
        <LedIndicator />
      </>
      )}
    </>
  );
};

export default App;
