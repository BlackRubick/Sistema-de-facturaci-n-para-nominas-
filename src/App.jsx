// src/App.jsx - Actualizado con estilos de gastos
import React from 'react';
import { AuthContextProvider } from './context/AuthContext';
import { AppContextProvider } from './context/AppContext';
import AppRoutes from './routes/AppRoutes';
import './styles/globals.css';
import './styles/components/auth.css';
import './styles/components/buttons.css';
import './styles/components/forms.css';
import './styles/components/sidebar.css';
import './styles/components/header.css';
import './styles/components/dashboard.css';
import './styles/components/payroll.css';
import './styles/components/employees.css'; 
import './styles/components/billing.css';
import './styles/components/gastos.css';

function App() {
  return (
    <AuthContextProvider>
      <AppContextProvider>
        <AppRoutes />
      </AppContextProvider>
    </AuthContextProvider>
  );
}

export default App;