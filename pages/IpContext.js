import React, { createContext, useContext, useState } from 'react';

const IpContext = createContext();

export const useIpContext = () => useContext(IpContext);

export const IPProvider = ({ children }) => {
  const [ipAddress, setIpAddress] = useState(''); // Initialize ipAddress as an empty string

  const addIpAddress = (ip) => {
    setIpAddress(ip); // Set ipAddress to the provided IP address (string)
  };

  return (
    <IpContext.Provider value={{ ipAddress, addIpAddress }}>
      {children}
    </IpContext.Provider>
  );
};
