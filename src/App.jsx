import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthContextProvider } from './context/AuthContext';
import { AppContextProvider } from './context/AppContext';
import './App.css';
import './styles/globals.css';

function App() {
  return (
    <AppContextProvider>
      <AuthContextProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthContextProvider>
    </AppContextProvider>
  );
}

export default App;
