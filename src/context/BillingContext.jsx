import React, { createContext, useContext, useState } from 'react';

const BillingContextContext = createContext();

export const useBillingContext = () => {
  const context = useContext(BillingContextContext);
  if (!context) {
    throw new Error('useBillingContext debe ser usado dentro de un BillingContextProvider');
  }
  return context;
};

export const BillingContextProvider = ({ children }) => {
  const [state, setState] = useState({});

  const value = {
    state,
    setState,
  };

  return (
    <BillingContextContext.Provider value={value}>
      {children}
    </BillingContextContext.Provider>
  );
};
