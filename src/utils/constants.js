// Constantes de la aplicación

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PAYROLL: '/payroll',
  BILLING: '/billing',
  EMPLOYEES: '/employees',
  SETTINGS: '/settings',
};

export const STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  PAID: 'paid',
  CANCELLED: 'cancelled',
};
