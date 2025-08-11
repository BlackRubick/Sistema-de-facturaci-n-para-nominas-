import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAppContext } from '../../context/AppContext';

const EmployeeCreate = () => {
  const navigate = useNavigate();
  const { addNotification } = useAppContext();
  
  const [formData, setFormData] = useState({
    // Información Personal
    name: '',
    identification: '',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    
    // Información Laboral
    position: '',
    department: '',
    baseSalary: '',
    hireDate: '',
    workSchedule: 'tiempo_completo',
    
    // Información Bancaria
    bankName: '',
    accountType: 'corriente',
    accountNumber: '',
    
    // Contacto de Emergencia
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    
    // Configuración
    status: 'activo'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const departments = [
    'Tecnología',
    'Recursos Humanos',
    'Finanzas',
    'Ventas',
    'Marketing',
    'Operaciones',
    'Diseño',
    'Administración'
  ];

  const bankNames = [
    'Banco de Venezuela',
    'Banesco',
    'Banco Mercantil',
    'BBVA Provincial',
    'Banco Bicentenario',
    'Bancaribe',
    'Banco del Tesoro',
    'Banco Activo'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.identification.trim()) newErrors.identification = 'La cédula es requerida';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!formData.position.trim()) newErrors.position = 'El cargo es requerido';
    if (!formData.department) newErrors.department = 'El departamento es requerido';
    if (!formData.baseSalary) newErrors.baseSalary = 'El salario base es requerido';
    if (!formData.hireDate) newErrors.hireDate = 'La fecha de ingreso es requerida';

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    // Salary validation
    if (formData.baseSalary && (isNaN(formData.baseSalary) || parseFloat(formData.baseSalary) <= 0)) {
      newErrors.baseSalary = 'El salario debe ser un número positivo';
    }

    // Phone validation (basic)
    if (formData.phone && formData.phone.length < 10) {
      newErrors.phone = 'El teléfono debe tener al menos 10 dígitos';
    }

    // Identification validation (Venezuelan format)
    if (formData.identification && !/^[VE]-?\d{7,8}$/i.test(formData.identification)) {
      newErrors.identification = 'Formato de cédula inválido (Ej: V-12345678)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addNotification({
        type: 'error',
        message: 'Por favor corrija los errores en el formulario'
      });
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      addNotification({
        type: 'success',
        message: 'Empleado creado exitosamente'
      });

      navigate('/empleados');
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || 'Error al crear empleado'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('¿Está seguro de cancelar? Se perderán todos los cambios.')) {
      navigate('/empleados');
    }
  };

  return (
    <div className="employee-create">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Nuevo Empleado</h1>
          <p>Complete la información del nuevo empleado</p>
        </div>
        <div className="page-actions">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={loading}
          >
            ← Cancelar
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="employee-form">
        {/* Información Personal */}
        <div className="form-section">
          <h2 className="form-section-title">Información Personal</h2>
          <div className="form-grid">
            <Input
              label="Nombre Completo"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ej: Juan Carlos Pérez"
              required
              error={errors.name}
            />

            <Input
              label="Cédula de Identidad"
              type="text"
              name="identification"
              value={formData.identification}
              onChange={handleInputChange}
              placeholder="Ej: V-12345678"
              required
              error={errors.identification}
            />

            <Input
              label="Fecha de Nacimiento"
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              error={errors.birthDate}
            />

            <Input
              label="Teléfono"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Ej: +58 414-1234567"
              required
              error={errors.phone}
            />

            <Input
              label="Correo Electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ejemplo@empresa.com"
              required
              error={errors.email}
            />

            <div className="input-group full-width">
              <Input
                label="Dirección"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Dirección completa"
                error={errors.address}
              />
            </div>
          </div>
        </div>

        {/* Información Laboral */}
        <div className="form-section">
          <h2 className="form-section-title">Información Laboral</h2>
          <div className="form-grid">
            <Input
              label="Cargo"
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="Ej: Desarrollador Senior"
              required
              error={errors.position}
            />

            <div className="input-group">
              <label className="input-label">
                Departamento <span className="input-required">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={`input ${errors.department ? 'input-error' : ''}`}
                required
              >
                <option value="">Seleccionar departamento...</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && (
                <span className="input-error-message">{errors.department}</span>
              )}
            </div>

            <Input
              label="Salario Base"
              type="number"
              name="baseSalary"
              value={formData.baseSalary}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              error={errors.baseSalary}
            />

            <Input
              label="Fecha de Ingreso"
              type="date"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleInputChange}
              required
              error={errors.hireDate}
            />

            <div className="input-group">
              <label className="input-label">Jornada Laboral</label>
              <select
                name="workSchedule"
                value={formData.workSchedule}
                onChange={handleInputChange}
                className="input"
              >
                <option value="tiempo_completo">Tiempo Completo</option>
                <option value="medio_tiempo">Medio Tiempo</option>
                <option value="por_horas">Por Horas</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="suspendido">Suspendido</option>
                <option value="vacaciones">En Vacaciones</option>
              </select>
            </div>
          </div>
        </div>

        {/* Información Bancaria */}
        <div className="form-section">
          <h2 className="form-section-title">Información Bancaria</h2>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">Banco</label>
              <select
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                className="input"
              >
                <option value="">Seleccionar banco...</option>
                {bankNames.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Tipo de Cuenta</label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                className="input"
              >
                <option value="corriente">Cuenta Corriente</option>
                <option value="ahorro">Cuenta de Ahorro</option>
              </select>
            </div>

            <Input
              label="Número de Cuenta"
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              placeholder="20 dígitos"
              maxLength="20"
            />
          </div>
        </div>

        {/* Contacto de Emergencia */}
        <div className="form-section">
          <h2 className="form-section-title">Contacto de Emergencia</h2>
          <div className="form-grid">
            <Input
              label="Nombre del Contacto"
              type="text"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleInputChange}
              placeholder="Nombre completo"
            />

            <Input
              label="Teléfono del Contacto"
              type="tel"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleInputChange}
              placeholder="+58 414-1234567"
            />

            <Input
              label="Relación"
              type="text"
              name="emergencyContactRelation"
              value={formData.emergencyContactRelation}
              onChange={handleInputChange}
              placeholder="Ej: Madre, Esposo(a), Hermano(a)"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions end">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
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
            {loading ? 'Creando...' : 'Crear Empleado'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeCreate;