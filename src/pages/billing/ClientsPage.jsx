// src/pages/billing/ClientsPage.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import { useAppContext } from '../../context/AppContext';
import CFDIService from '../../services/cfdiService';

const ClientsPage = () => {
  const { addNotification } = useAppContext();
  
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    rfc: '',
    email: '',
    phone: '',
    address: '',
    fiscalRegime: '612',
    cfdiUse: 'G03',
    residenciaFiscal: '',
    numeroRegIdTrib: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const result = await CFDIService.getClients();
      setClients(result.data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      addNotification({
        type: 'error',
        message: 'Error al cargar clientes: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.rfc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      rfc: '',
      email: '',
      phone: '',
      address: '',
      fiscalRegime: '612',
      cfdiUse: 'G03',
      residenciaFiscal: '',
      numeroRegIdTrib: ''
    });
    setEditingClient(null);
    setShowForm(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.name.trim()) errors.push('El nombre es requerido');
    if (!formData.rfc.trim()) errors.push('El RFC es requerido');
    if (!formData.email.trim()) errors.push('El email es requerido');
    
    // Validar formato de RFC (básico)
    const rfcPattern = /^[A-Z&Ñ]{3,4}[0-9]{6}[A-V1-9][A-Z1-9][0-9A]$/;
    if (formData.rfc && !rfcPattern.test(formData.rfc.toUpperCase())) {
      errors.push('Formato de RFC inválido');
    }
    
    // Validar email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailPattern.test(formData.email)) {
      errors.push('Formato de email inválido');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      addNotification({
        type: 'error',
        message: 'Errores: ' + validationErrors.join(', ')
      });
      return;
    }

    try {
      setFormLoading(true);

      const clientData = {
        name: formData.name,
        rfc: formData.rfc.toUpperCase(),
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        fiscal_regime: formData.fiscalRegime,
        cfdi_use: formData.cfdiUse,
        residencia_fiscal: formData.residenciaFiscal,
        numero_reg_id_trib: formData.numeroRegIdTrib
      };

      if (editingClient) {
        // Actualizar cliente existente
        await CFDIService.updateClient(editingClient.id, clientData);
        addNotification({
          type: 'success',
          message: 'Cliente actualizado exitosamente'
        });
      } else {
        // Crear nuevo cliente
        await CFDIService.createClient(clientData);
        addNotification({
          type: 'success',
          message: 'Cliente creado exitosamente'
        });
      }

      resetForm();
      loadClients();
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || 'Error al guardar cliente'
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (client) => {
    setFormData({
      name: client.name || '',
      rfc: client.rfc || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      fiscalRegime: client.fiscal_regime || '612',
      cfdiUse: client.cfdi_use || 'G03',
      residenciaFiscal: client.residencia_fiscal || '',
      numeroRegIdTrib: client.numero_reg_id_trib || ''
    });
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = async (clientId) => {
    if (window.confirm('¿Está seguro de eliminar este cliente? Esta acción no se puede deshacer.')) {
      try {
        await CFDIService.deleteClient(clientId);
        addNotification({
          type: 'success',
          message: 'Cliente eliminado exitosamente'
        });
        loadClients();
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Error al eliminar cliente: ' + error.message
        });
      }
    }
  };

  const regimeOptions = [
    { value: '601', label: '601 - General de Ley Personas Morales' },
    { value: '603', label: '603 - Personas Morales con Fines no Lucrativos' },
    { value: '605', label: '605 - Sueldos y Salarios e Ingresos Asimilados a Salarios' },
    { value: '606', label: '606 - Arrendamiento' },
    { value: '607', label: '607 - Régimen de Enajenación o Adquisición de Bienes' },
    { value: '608', label: '608 - Demás ingresos' },
    { value: '610', label: '610 - Residentes en el Extranjero sin Establecimiento Permanente en México' },
    { value: '611', label: '611 - Ingresos por Dividendos (socios y accionistas)' },
    { value: '612', label: '612 - Persona Física con Actividades Empresariales' },
    { value: '614', label: '614 - Ingresos por intereses' },
    { value: '615', label: '615 - Régimen de los ingresos por obtención de premios' },
    { value: '616', label: '616 - Sin obligaciones fiscales' }
  ];

  const cfdiUseOptions = [
    { value: 'G01', label: 'G01 - Adquisición de mercancías' },
    { value: 'G02', label: 'G02 - Devoluciones, descuentos o bonificaciones' },
    { value: 'G03', label: 'G03 - Gastos en general' },
    { value: 'I01', label: 'I01 - Construcciones' },
    { value: 'I02', label: 'I02 - Mobilario y equipo de oficina por inversiones' },
    { value: 'I03', label: 'I03 - Equipo de transporte' },
    { value: 'I04', label: 'I04 - Equipo de cómputo y accesorios' },
    { value: 'I05', label: 'I05 - Dados, troqueles, moldes, matrices y herramental' },
    { value: 'I06', label: 'I06 - Comunicaciones telefónicas' },
    { value: 'I07', label: 'I07 - Comunicaciones satelitales' },
    { value: 'I08', label: 'I08 - Otra maquinaria y equipo' },
    { value: 'D01', label: 'D01 - Honorarios médicos, dentales y gastos hospitalarios' },
    { value: 'D02', label: 'D02 - Gastos médicos por incapacidad o discapacidad' },
    { value: 'D03', label: 'D03 - Gastos funerales' },
    { value: 'D04', label: 'D04 - Donativos' },
    { value: 'D05', label: 'D05 - Intereses reales efectivamente pagados por créditos hipotecarios' },
    { value: 'D06', label: 'D06 - Aportaciones voluntarias al SAR' },
    { value: 'D07', label: 'D07 - Primas por seguros de gastos médicos' },
    { value: 'D08', label: 'D08 - Gastos de transportación escolar obligatoria' },
    { value: 'D09', label: 'D09 - Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones' },
    { value: 'D10', label: 'D10 - Pagos por servicios educativos (colegiaturas)' },
    { value: 'P01', label: 'P01 - Por definir' }
  ];

  if (loading) {
    return <Loading text="Cargando clientes..." />;
  }

  return (
    <div className="clients-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Gestión de Clientes</h1>
          <p>Administra la información de tus clientes para facturación</p>
        </div>
        <div className="page-actions">
          <Button 
            variant="primary"
            onClick={() => setShowForm(true)}
          >
            ➕ Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Formulario de Cliente */}
      {showForm && (
        <div className="client-form-section">
          <div className="form-header">
            <h2>{editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
            <Button variant="outline" onClick={resetForm}>
              ✕ Cerrar
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="client-form">
            <div className="form-grid">
              <Input
                label="Nombre/Razón Social"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nombre completo o razón social"
                required
              />

              <Input
                label="RFC"
                type="text"
                value={formData.rfc}
                onChange={(e) => handleInputChange('rfc', e.target.value.toUpperCase())}
                placeholder="RFC del cliente"
                maxLength="13"
                required
              />

              <Input
                label="Correo Electrónico"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@ejemplo.com"
                required
              />

              <Input
                label="Teléfono"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Teléfono del cliente"
              />

              <div className="input-group">
                <label className="input-label">Régimen Fiscal</label>
                <select
                  value={formData.fiscalRegime}
                  onChange={(e) => handleInputChange('fiscalRegime', e.target.value)}
                  className="input"
                  required
                >
                  {regimeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Uso de CFDI</label>
                <select
                  value={formData.cfdiUse}
                  onChange={(e) => handleInputChange('cfdiUse', e.target.value)}
                  className="input"
                  required
                >
                  {cfdiUseOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Dirección"
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Dirección completa"
                className="full-width"
              />

              <Input
                label="Residencia Fiscal (Extranjeros)"
                type="text"
                value={formData.residenciaFiscal}
                onChange={(e) => handleInputChange('residenciaFiscal', e.target.value)}
                placeholder="Solo para residentes extranjeros"
              />

              <Input
                label="Número Reg. ID Tributario"
                type="text"
                value={formData.numeroRegIdTrib}
                onChange={(e) => handleInputChange('numeroRegIdTrib', e.target.value)}
                placeholder="Solo para residentes extranjeros"
              />
            </div>

            <div className="form-actions end">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={formLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={formLoading}
                disabled={formLoading}
              >
                {formLoading ? 'Guardando...' : (editingClient ? 'Actualizar' : 'Crear Cliente')}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Controles de búsqueda y estadísticas */}
      <div className="clients-controls">
        <div className="search-section">
          <Input
            type="text"
            placeholder="Buscar por nombre, RFC o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="clients-stats">
          <div className="stat-card">
            <h3>Total Clientes</h3>
            <p className="stat-value">{clients.length}</p>
          </div>
          <div className="stat-card">
            <h3>Personas Físicas</h3>
            <p className="stat-value">
              {clients.filter(c => c.fiscal_regime === '612').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Personas Morales</h3>
            <p className="stat-value">
              {clients.filter(c => c.fiscal_regime === '601').length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="clients-table-container">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Contacto</th>
              <th>Régimen Fiscal</th>
              <th>Uso CFDI</th>
              <th>Facturas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <div className="client-cell">
                      <div className="client-info">
                        <strong>{client.name}</strong>
                        <small>{client.rfc}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <strong>{client.email}</strong>
                      {client.phone && <small>{client.phone}</small>}
                    </div>
                  </td>
                  <td>
                    <span className="regime-badge">
                      {regimeOptions.find(r => r.value === client.fiscal_regime)?.label.split(' - ')[0] || client.fiscal_regime}
                    </span>
                  </td>
                  <td>
                    <span className="cfdi-use-badge">
                      {cfdiUseOptions.find(u => u.value === client.cfdi_use)?.label.split(' - ')[0] || client.cfdi_use}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="invoice-count">
                      {client.invoice_count || 0}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Button
                        size="small"
                        variant="outline"
                        onClick={() => handleEdit(client)}
                        title="Editar"
                      >
                        ✏️
                      </Button>
                      <Button
                        size="small"
                        variant="error"
                        onClick={() => handleDelete(client.id)}
                        title="Eliminar"
                      >
                        🗑️
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  {searchTerm ? 
                    'No se encontraron clientes con el término de búsqueda' : 
                    'No hay clientes registrados'
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsPage;