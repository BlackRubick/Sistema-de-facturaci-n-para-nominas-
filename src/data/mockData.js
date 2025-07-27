// Datos de prueba para desarrollo

export const mockEmployees = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@example.com',
    position: 'Desarrollador',
    salary: 50000,
    department: 'IT'
  },
  // Agregar más empleados de prueba
];

export const mockPayrolls = [
  {
    id: 1,
    employeeId: 1,
    period: '2024-01',
    grossSalary: 50000,
    netSalary: 40000,
    deductions: 10000
  },
  // Agregar más nóminas de prueba
];

export const mockInvoices = [
  {
    id: 1,
    clientName: 'Cliente Ejemplo',
    amount: 15000,
    status: 'pending',
    date: '2024-01-15'
  },
  // Agregar más facturas de prueba
];
