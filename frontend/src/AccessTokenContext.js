import React, { createContext, useState, useEffect } from 'react';

export const AccessTokenContext = createContext();

export const AccessTokenProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
  }, []);

  const updateAccessToken = (newAccessToken) => {
    setAccessToken(newAccessToken);
    localStorage.setItem('accessToken', newAccessToken);
  };

  const clearAccessToken = () => {
    setAccessToken(null);
    localStorage.removeItem('accessToken');
  };

  return (
    <AccessTokenContext.Provider
      value={{ accessToken, updateAccessToken, clearAccessToken }}
    >
      {children}
    </AccessTokenContext.Provider>
  );
};
