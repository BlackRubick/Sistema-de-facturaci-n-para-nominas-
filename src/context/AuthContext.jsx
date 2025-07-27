import React, { createContext, useContext, useState } from 'react';

const AuthContextContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContextContext);
  if (!context) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthContextProvider');
  }
  return context;
};

export const AuthContextProvider = ({ children }) => {
  const [state, setState] = useState({});

  const value = {
    state,
    setState,
  };

  return (
    <AuthContextContext.Provider value={value}>
      {children}
    </AuthContextContext.Provider>
  );
};
