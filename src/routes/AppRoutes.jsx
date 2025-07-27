import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

// Pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

// Payroll Pages
import PayrollPage from '../pages/payroll/PayrollPage';
import PayrollCreate from '../pages/payroll/PayrollCreate';
import PayrollEdit from '../pages/payroll/PayrollEdit';
import PayrollGroups from '../pages/payroll/PayrollGroups';
import PayrollReports from '../pages/payroll/PayrollReports';

// Billing Pages
import BillingPage from '../pages/billing/BillingPage';
import InvoiceCreate from '../pages/billing/InvoiceCreate';
import InvoiceEdit from '../pages/billing/InvoiceEdit';
import ClientsPage from '../pages/billing/ClientsPage';
import BillingReports from '../pages/billing/BillingReports';

// Employee Pages
import EmployeePage from '../pages/employees/EmployeePage';
import EmployeeCreate from '../pages/employees/EmployeeCreate';
import EmployeeEdit from '../pages/employees/EmployeeEdit';

// Settings Pages
import SettingsPage from '../pages/settings/SettingsPage';
import CompanySettings from '../pages/settings/CompanySettings';
import UserSettings from '../pages/settings/UserSettings';
import SystemSettings from '../pages/settings/SystemSettings';

// Layout Components
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const Layout = ({ children }) => {
  const { sidebarCollapsed } = useAppContext();
  
  return (
    <div className="main-layout">
      <Sidebar />
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header />
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Login />
          } 
        />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Navigate to="/dashboard" replace />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Payroll Routes */}
        <Route path="/nominas" element={
          <ProtectedRoute>
            <Layout>
              <PayrollPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/nominas/crear" element={
          <ProtectedRoute>
            <Layout>
              <PayrollCreate />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/nominas/editar/:id" element={
          <ProtectedRoute>
            <Layout>
              <PayrollEdit />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/nominas/grupos" element={
          <ProtectedRoute>
            <Layout>
              <PayrollGroups />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/nominas/reportes" element={
          <ProtectedRoute>
            <Layout>
              <PayrollReports />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Billing Routes */}
        <Route path="/facturacion" element={
          <ProtectedRoute>
            <Layout>
              <BillingPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/facturacion/crear" element={
          <ProtectedRoute>
            <Layout>
              <InvoiceCreate />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/facturacion/editar/:id" element={
          <ProtectedRoute>
            <Layout>
              <InvoiceEdit />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/clientes" element={
          <ProtectedRoute>
            <Layout>
              <ClientsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/facturacion/reportes" element={
          <ProtectedRoute>
            <Layout>
              <BillingReports />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Employee Routes */}
        <Route path="/empleados" element={
          <ProtectedRoute>
            <Layout>
              <EmployeePage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/empleados/crear" element={
          <ProtectedRoute>
            <Layout>
              <EmployeeCreate />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/empleados/editar/:id" element={
          <ProtectedRoute>
            <Layout>
              <EmployeeEdit />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Settings Routes */}
        <Route path="/configuracion" element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/configuracion/empresa" element={
          <ProtectedRoute>
            <Layout>
              <CompanySettings />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/configuracion/usuario" element={
          <ProtectedRoute>
            <Layout>
              <UserSettings />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/configuracion/sistema" element={
          <ProtectedRoute>
            <Layout>
              <SystemSettings />
            </Layout>
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={
          <ProtectedRoute>
            <Layout>
              <div className="error-404">
                <h1>404 - Página no encontrada</h1>
                <p>La página que buscas no existe.</p>
              </div>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default AppRoutes;