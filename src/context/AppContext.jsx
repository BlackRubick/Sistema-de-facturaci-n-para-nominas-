import React, { createContext, useContext, useState } from 'react';

const AppContextContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContextContext);
  if (!context) {
    throw new Error('useAppContext debe ser usado dentro de un AppContextProvider');
  }
  return context;
};

export const AppContextProvider = ({ children }) => {
  const [state, setState] = useState({});

  const value = {
    state,
    setState,
  };

  return (
    <AppContextContext.Provider value={value}>
      {children}
    </AppContextContext.Provider>
  );
};
