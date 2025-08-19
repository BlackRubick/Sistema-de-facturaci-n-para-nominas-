// src/pages/gastos/GastoCreate.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAppContext } from '../../context/AppContext';

const GastoCreate = () => {
  const navigate = useNavigate();
  const { addNotification } = useAppContext();
  
  const [formData, setFormData] = useState({
    concepto: '',
    descripcion: '',
    monto: '',
    categoria: '',
    proveedor: '',
    fecha: new Date().toISOString().split('T')[0],
    fechaSolicitud: new Date().toISOString().split('T')[0],
    solicitante: '',
    departamento: '',
    centroCosto: '',
    metodoPago: 'transferencia',
    cuentaContable: '',
    justificacion: '',
    urgencia: 'normal',
    requiereFactura: true,
    presupuestoAnual: false,
    observaciones: ''
  });

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [autoridades, setAutoridades] = useState([]);

  const categorias = [
    'Suministros de Oficina',
    'Mantenimiento',
    'Transporte',
    'Marketing',
    'Servicios Profesionales',
    'Equipos y Tecnología',
    'Servicios Públicos',
    'Capacitación',
    'Viáticos',
    'Otros'
  ];

  const departamentos = [
    'Administración',
    'Tecnología',
    'Recursos Humanos',
    'Finanzas',
    'Ventas',
    'Marketing',
    'Operaciones',
    'Diseño'
  ];

  const centrosCosto = [
    'CC-001 - Administración General',
    'CC-002 - Desarrollo de Software',
    'CC-003 - Marketing Digital',
    'CC-004 - Ventas Corporativas',
    'CC-005 - Soporte Técnico',
    'CC-006 - Recursos Humanos'
  ];

  useEffect(() => {
    loadEmployees();
    loadAutoridades();
  }, []);

  const loadEmployees = async () => {
    const mockEmployees = [
      { id: 1, name: 'Juan Pérez', department: 'Tecnología' },
      { id: 2, name: 'María González', department: 'Diseño' },
      { id: 3, name: 'Carlos López', department: 'Ventas' },
      { id: 4, name: 'Ana Martínez', department: 'Finanzas' },
      { id: 5, name: 'Luis Rodríguez', department: 'Operaciones' }
    ];
    setEmployees(mockEmployees);
  };

  const loadAutoridades = async () => {
    const mockAutoridades = [
      { id: 1, name: 'Carlos López', role: 'Gerente de Ventas', maxAmount: 50000 },
      { id: 2, name: 'Ana Martínez', role: 'Gerente de Finanzas', maxAmount: 100000 },
      { id: 3, name: 'Director General', role: 'Director General', maxAmount: 999999 }
    ];
    setAutoridades(mockAutoridades);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.concepto.trim()) errors.push('El concepto es requerido');
    if (!formData.descripcion.trim()) errors.push('La descripción es requerida');
    if (!formData.monto || parseFloat(formData.monto) <= 0) errors.push('El monto debe ser mayor a 0');
    if (!formData.categoria) errors.push('La categoría es requerida');
    if (!formData.solicitante) errors.push('El solicitante es requerido');
    if (!formData.departamento) errors.push('El departamento es requerido');
    if (!formData.fecha) errors.push('La fecha es requerida');
    if (!formData.justificacion.trim()) errors.push('La justificación es requerida');

    return errors;
  };

  const getAutoridadSugerida = () => {
    const monto = parseFloat(formData.monto) || 0;
    return autoridades.find(auth => monto <= auth.maxAmount) || autoridades[autoridades.length - 1];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      addNotification({
        type: 'error',
        message: 'Errores en el formulario: ' + validationErrors.join(', ')
      });
      return;
    }

    setLoading(true);

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Auto-asignar autoridad basada en el monto
      const autoridadSugerida = getAutoridadSugerida();

      const gastoData = {
        ...formData,
        autorizadoPor: autoridadSugerida.name,
        status: 'pendiente',
        fechaCreacion: new Date().toISOString()
      };

      addNotification({
        type: 'success',
        message: 'Solicitud de gasto creada exitosamente'
      });

      navigate('/gastos');
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || 'Error al crear solicitud de gasto'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('¿Está seguro de cancelar? Se perderán todos los cambios.')) {
      navigate('/gastos');
    }
  };

  const autoridadSugerida = getAutoridadSugerida();

  return (
    <div className="gasto-create">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Nueva Solicitud de Gasto</h1>
          <p>Complete la información para crear una nueva solicitud de gasto</p>
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

      <form onSubmit={handleSubmit} className="gasto-form">
        {/* Información Básica */}
        <div className="form-section">
          <h2 className="form-section-title">Información del Gasto</h2>
          <div className="form-grid">
            <Input
              label="Concepto del Gasto"
              type="text"
              name="concepto"
              value={formData.concepto}
              onChange={handleInputChange}
              placeholder="Ej: Material de oficina"
              required
            />

            <div className="input-group">
              <label className="input-label">
                Categoría <span className="input-required">*</span>
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className="input"
                required
              >
                <option value="">Seleccionar categoría...</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <Input
              label="Monto"
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />

            <Input
              label="Proveedor"
              type="text"
              name="proveedor"
              value={formData.proveedor}
              onChange={handleInputChange}
              placeholder="Nombre del proveedor"
            />

            <Input
              label="Fecha del Gasto"
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
            />

            <div className="input-group">
              <label className="input-label">
                Urgencia
              </label>
              <select
                name="urgencia"
                value={formData.urgencia}
                onChange={handleInputChange}
                className="input"
              >
                <option value="baja">Baja</option>
                <option value="normal">Normal</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">
              Descripción Detallada <span className="input-required">*</span>
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="input textarea"
              rows="3"
              placeholder="Describa detalladamente el gasto y su propósito..."
              required
            />
          </div>
        </div>

        {/* Información del Solicitante */}
        <div className="form-section">
          <h2 className="form-section-title">Información del Solicitante</h2>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">
                Solicitante <span className="input-required">*</span>
              </label>
              <select
                name="solicitante"
                value={formData.solicitante}
                onChange={handleInputChange}
                className="input"
                required
              >
                <option value="">Seleccionar empleado...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name} - {emp.department}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">
                Departamento <span className="input-required">*</span>
              </label>
              <select
                name="departamento"
                value={formData.departamento}
                onChange={handleInputChange}
                className="input"
                required
              >
                <option value="">Seleccionar departamento...</option>
                {departamentos.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Centro de Costo</label>
              <select
                name="centroCosto"
                value={formData.centroCosto}
                onChange={handleInputChange}
                className="input"
              >
                <option value="">Seleccionar centro de costo...</option>
                {centrosCosto.map(cc => (
                  <option key={cc} value={cc}>{cc}</option>
                ))}
              </select>
            </div>

            <Input
              label="Fecha de Solicitud"
              type="date"
              name="fechaSolicitud"
              value={formData.fechaSolicitud}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Información Contable y de Pago */}
        <div className="form-section">
          <h2 className="form-section-title">Información Contable</h2>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">Método de Pago</label>
              <select
                name="metodoPago"
                value={formData.metodoPago}
                onChange={handleInputChange}
                className="input"
              >
                <option value="transferencia">Transferencia Bancaria</option>
                <option value="cheque">Cheque</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta Corporativa</option>
              </select>
            </div>

            <Input
              label="Cuenta Contable"
              type="text"
              name="cuentaContable"
              value={formData.cuentaContable}
              onChange={handleInputChange}
              placeholder="Ej: 5101-001"
            />

            <div className="input-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  name="requiereFactura"
                  checked={formData.requiereFactura}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-label">Requiere Factura</span>
              </label>
            </div>

            <div className="input-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  name="presupuestoAnual"
                  checked={formData.presupuestoAnual}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-label">Contemplado en Presupuesto Anual</span>
              </label>
            </div>
          </div>
        </div>

        {/* Justificación */}
        <div className="form-section">
          <h2 className="form-section-title">Justificación y Autorización</h2>
          
          <div className="input-group">
            <label className="input-label">
              Justificación del Gasto <span className="input-required">*</span>
            </label>
            <textarea
              name="justificacion"
              value={formData.justificacion}
              onChange={handleInputChange}
              className="input textarea"
              rows="4"
              placeholder="Explique detalladamente por qué es necesario este gasto y cómo beneficia a la empresa..."
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Observaciones Adicionales</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleInputChange}
              className="input textarea"
              rows="3"
              placeholder="Cualquier información adicional relevante..."
            />
          </div>

          {/* Autoridad Sugerida */}
          {formData.monto && (
            <div className="autoridad-sugerida">
              <h4>Autoridad Sugerida para Aprobación</h4>
              <div className="autoridad-info">
                <p><strong>Nombre:</strong> {autoridadSugerida.name}</p>
                <p><strong>Cargo:</strong> {autoridadSugerida.role}</p>
                <p><strong>Límite de Aprobación:</strong> ${autoridadSugerida.maxAmount.toLocaleString()}</p>
              </div>
              <small className="helper-text">
                Esta autoridad será asignada automáticamente basada en el monto del gasto.
              </small>
            </div>
          )}
        </div>

        {/* Resumen */}
        <div className="form-section">
          <h3>Resumen de la Solicitud</h3>
          <div className="resumen-grid">
            <div className="resumen-item">
              <span className="resumen-label">Concepto:</span>
              <span className="resumen-value">{formData.concepto || 'Sin especificar'}</span>
            </div>
            <div className="resumen-item">
              <span className="resumen-label">Monto:</span>
              <span className="resumen-value">
                {formData.monto ? `${parseFloat(formData.monto).toLocaleString()}` : '$0.00'}
              </span>
            </div>
            <div className="resumen-item">
              <span className="resumen-label">Categoría:</span>
              <span className="resumen-value">{formData.categoria || 'Sin especificar'}</span>
            </div>
            <div className="resumen-item">
              <span className="resumen-label">Solicitante:</span>
              <span className="resumen-value">{formData.solicitante || 'Sin especificar'}</span>
            </div>
            <div className="resumen-item">
              <span className="resumen-label">Urgencia:</span>
              <span className={`resumen-value urgencia-${formData.urgencia}`}>
                {formData.urgencia.charAt(0).toUpperCase() + formData.urgencia.slice(1)}
              </span>
            </div>
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
            {loading ? 'Creando Solicitud...' : 'Crear Solicitud de Gasto'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GastoCreate;