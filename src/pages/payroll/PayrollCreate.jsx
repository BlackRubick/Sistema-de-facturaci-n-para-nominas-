import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAppContext } from '../../context/AppContext';
import '../../styles/components/payroll.css';

const PayrollCreate = () => {
  const navigate = useNavigate();
  const { addNotification } = useAppContext();
  
  const [formData, setFormData] = useState({
    employeeId: '',
    period: '',
    basicSalary: '',
    allowances: {
      transportation: '',
      food: '',
      housing: '',
      other: ''
    },
    overtime: {
      hours: '',
      rate: ''
    },
    deductions: {
      socialSecurity: '',
      incomeTax: '',
      insurance: '',
      other: ''
    },
    payDate: '',
    notes: ''
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calculations, setCalculations] = useState({
    grossSalary: 0,
    totalAllowances: 0,
    totalDeductions: 0,
    netSalary: 0
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [formData]);

  const loadEmployees = async () => {
    try {
      // Simulate API call
      const mockEmployees = [
        { id: 1, name: 'Juan Pérez', position: 'Desarrollador', basicSalary: 50000 },
        { id: 2, name: 'María González', position: 'Diseñadora', basicSalary: 45000 },
        { id: 3, name: 'Carlos López', position: 'Gerente', basicSalary: 80000 },
        { id: 4, name: 'Ana Martínez', position: 'Contadora', basicSalary: 55000 }
      ];
      setEmployees(mockEmployees);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al cargar empleados'
      });
    }
  };

  const calculateTotals = () => {
    const basicSalary = parseFloat(formData.basicSalary) || 0;
    
    // Calculate allowances
    const totalAllowances = Object.values(formData.allowances)
      .reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
    
    // Calculate overtime
    const overtimeAmount = (parseFloat(formData.overtime.hours) || 0) * 
                          (parseFloat(formData.overtime.rate) || 0);
    
    // Gross salary
    const grossSalary = basicSalary + totalAllowances + overtimeAmount;
    
    // Calculate deductions
    const totalDeductions = Object.values(formData.deductions)
      .reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
    
    // Net salary
    const netSalary = grossSalary - totalDeductions;

    setCalculations({
      grossSalary,
      totalAllowances: totalAllowances + overtimeAmount,
      totalDeductions,
      netSalary
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    const selectedEmployee = employees.find(emp => emp.id === parseInt(employeeId));
    
    setFormData(prev => ({
      ...prev,
      employeeId,
      basicSalary: selectedEmployee ? selectedEmployee.basicSalary.toString() : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.employeeId || !formData.period || !formData.basicSalary || !formData.payDate) {
        throw new Error('Por favor complete todos los campos requeridos');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      addNotification({
        type: 'success',
        message: 'Nómina creada exitosamente'
      });

      navigate('/nominas');
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || 'Error al crear nómina'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="payroll-create">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Crear Nueva Nómina</h1>
          <p>Complete la información para generar una nueva nómina</p>
        </div>
        <div className="page-actions">
          <Button 
            variant="outline" 
            onClick={() => navigate('/nominas')}
          >
            ← Volver
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="payroll-form">
        {/* Basic Information */}
        <div className="form-section">
          <h2 className="form-section-title">Información Básica</h2>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">
                Empleado <span className="input-required">*</span>
              </label>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleEmployeeChange}
                className="input"
                required
              >
                <option value="">Seleccionar empleado...</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.position}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Período"
              type="text"
              name="period"
              value={formData.period}
              onChange={handleInputChange}
              placeholder="Ej: Enero 2024"
              required
            />

            <Input
              label="Salario Básico"
              type="number"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleInputChange}
              placeholder="0.00"
              required
            />

            <Input
              label="Fecha de Pago"
              type="date"
              name="payDate"
              value={formData.payDate}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Allowances */}
        <div className="form-section">
          <h2 className="form-section-title">Asignaciones</h2>
          <div className="form-grid">
            <Input
              label="Bono de Transporte"
              type="number"
              name="allowances.transportation"
              value={formData.allowances.transportation}
              onChange={handleInputChange}
              placeholder="0.00"
            />

            <Input
              label="Bono de Alimentación"
              type="number"
              name="allowances.food"
              value={formData.allowances.food}
              onChange={handleInputChange}
              placeholder="0.00"
            />

            <Input
              label="Bono de Vivienda"
              type="number"
              name="allowances.housing"
              value={formData.allowances.housing}
              onChange={handleInputChange}
              placeholder="0.00"
            />

            <Input
              label="Otras Asignaciones"
              type="number"
              name="allowances.other"
              value={formData.allowances.other}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Overtime */}
        <div className="form-section">
          <h2 className="form-section-title">Horas Extra</h2>
          <div className="form-grid">
            <Input
              label="Horas Trabajadas"
              type="number"
              name="overtime.hours"
              value={formData.overtime.hours}
              onChange={handleInputChange}
              placeholder="0"
            />

            <Input
              label="Tarifa por Hora"
              type="number"
              name="overtime.rate"
              value={formData.overtime.rate}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Deductions */}
        <div className="form-section">
          <h2 className="form-section-title">Deducciones</h2>
          <div className="form-grid">
            <Input
              label="Seguro Social"
              type="number"
              name="deductions.socialSecurity"
              value={formData.deductions.socialSecurity}
              onChange={handleInputChange}
              placeholder="0.00"
            />

            <Input
              label="Impuesto sobre la Renta"
              type="number"
              name="deductions.incomeTax"
              value={formData.deductions.incomeTax}
              onChange={handleInputChange}
              placeholder="0.00"
            />

            <Input
              label="Seguro Médico"
              type="number"
              name="deductions.insurance"
              value={formData.deductions.insurance}
              onChange={handleInputChange}
              placeholder="0.00"
            />

            <Input
              label="Otras Deducciones"
              type="number"
              name="deductions.other"
              value={formData.deductions.other}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="form-section">
          <h2 className="form-section-title">Notas Adicionales</h2>
          <div className="input-group">
            <label className="input-label">Observaciones</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="input textarea"
              rows="4"
              placeholder="Ingrese cualquier observación adicional..."
            />
          </div>
        </div>

        {/* Calculation Summary */}
        <div className="calculation-summary">
          <h3>Resumen de Cálculos</h3>
          
          <div className="calculation-row">
            <span className="calculation-label">Salario Básico:</span>
            <span className="calculation-value">{formatCurrency(parseFloat(formData.basicSalary) || 0)}</span>
          </div>
          
          <div className="calculation-row">
            <span className="calculation-label">Total Asignaciones:</span>
            <span className="calculation-value">{formatCurrency(calculations.totalAllowances)}</span>
          </div>
          
          <div className="calculation-row">
            <span className="calculation-label">Salario Bruto:</span>
            <span className="calculation-value">{formatCurrency(calculations.grossSalary)}</span>
          </div>
          
          <div className="calculation-row">
            <span className="calculation-label">Total Deducciones:</span>
            <span className="calculation-value text-error">-{formatCurrency(calculations.totalDeductions)}</span>
          </div>
          
          <div className="calculation-row">
            <span className="calculation-label">Salario Neto:</span>
            <span className="calculation-value">{formatCurrency(calculations.netSalary)}</span>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/nominas')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Nómina'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PayrollCreate;