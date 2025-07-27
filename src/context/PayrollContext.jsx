import React, { createContext, useContext, useState } from 'react';

const PayrollContextContext = createContext();

export const usePayrollContext = () => {
  const context = useContext(PayrollContextContext);
  if (!context) {
    throw new Error('usePayrollContext debe ser usado dentro de un PayrollContextProvider');
  }
  return context;
};

export const PayrollContextProvider = ({ children }) => {
  const [state, setState] = useState({});

  const value = {
    state,
    setState,
  };

  return (
    <PayrollContextContext.Provider value={value}>
      {children}
    </PayrollContextContext.Provider>
  );
};
