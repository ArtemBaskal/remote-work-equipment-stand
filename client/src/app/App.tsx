import React from 'react';
import Auth from 'features/auth/Auth';
import FileUploader from 'components/FileUploader';
import { useSelector } from 'react-redux';

const App = () => {
  const name = useSelector((state: any) => state.auth.name);
  const isAuthenticated = !!name;

  return (
    <>
      <Auth />
      {isAuthenticated && <FileUploader />}
    </>
  );
};

export default App;
