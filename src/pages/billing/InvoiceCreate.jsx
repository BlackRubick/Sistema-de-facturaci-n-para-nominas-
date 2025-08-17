// src/pages/billing/InvoiceCreate.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAppContext } from '../../context/AppContext';
import CFDIService from '../../services/cfdiService';
import '../../styles/components/billing.css';

const InvoiceCreate = () => {
  const navigate = useNavigate();
  const { addNotification } = useAppContext();
  
  // Estados principales
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [series, setSeries] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Información del cliente
    clientId: '',
    clientData: {
      name: '',
      rfc: '',
      email: '',
      phone: '',
      address: '',
      fiscalRegime: '612', // Persona Física con Actividades Empresariales
      cfdiUse: 'G03' // Gastos en general
    },
    
    // Información de la factura
    serie: '',
    paymentForm: '03', // Transferencia electrónica
    paymentMethod: 'PUE', // Pago en una sola exhibición
    currency: 'MXN',
    issuePlace: '44100', // Guadalajara por defecto
    
    // Items de la factura
    items: [
      {
        id: 1,
        description: '',
        quantity: 1,
        unit: 'Unidad de servicio',
        unitCode: 'E48',
        price: 0,
        satCode: '81112101', // Código SAT por defecto
        discount: 0,
        sku: ''
      }
    ],
    
    // Configuraciones adicionales
    notes: '',
    orderNumber: '',
    sendEmail: true,
    draft: false
  });

  // Estados de cálculo
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
    totalDiscount: 0
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Recalcular totales cuando cambien los items
  useEffect(() => {
    calculateTotals();
  }, [formData.items]);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      
      // Validar configuración
      CFDIService.validateConfig();
      
      // Cargar clientes y series en paralelo
      const [clientsResult, seriesResult] = await Promise.all([
        CFDIService.getClients().catch(() => ({ data: [] })),
        CFDIService.getSeries().catch(() => ({ data: [] }))
      ]);

      setClients(clientsResult.data || []);
      setSeries(seriesResult.data || []);
      
      // Seleccionar primera serie disponible
      if (seriesResult.data && seriesResult.data.length > 0) {
        setFormData(prev => ({
          ...prev,
          serie: seriesResult.data[0].id
        }));
      }

    } catch (error) {
      console.error('Error loading initial data:', error);
      addNotification({
        type: 'error',
        message: error.message || 'Error al cargar datos iniciales'
      });
    } finally {
      setLoadingData(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      const itemTotal = parseFloat(item.quantity || 0) * parseFloat(item.price || 0);
      const itemDiscount = parseFloat(item.discount || 0);
      return sum + (itemTotal - itemDiscount);
    }, 0);

    const totalDiscount = formData.items.reduce((sum, item) => 
      sum + parseFloat(item.discount || 0), 0
    );

    const tax = subtotal * 0.16; // IVA 16%
    const total = subtotal + tax;

    setCalculations({
      subtotal,
      tax,
      total,
      totalDiscount
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClientDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      clientData: {
        ...prev.clientData,
        [field]: value
      }
    }));
  };

  const handleItemChange = (itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      description: '',
      quantity: 1,
      unit: 'Unidad de servicio',
      unitCode: 'E48',
      price: 0,
      satCode: '81112101',
      discount: 0,
      sku: ''
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (itemId) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      }));
    }
  };

  const handleClientSelect = (clientId) => {
    const selectedClient = clients.find(c => c.id === parseInt(clientId));
    if (selectedClient) {
      setFormData(prev => ({
        ...prev,
        clientId: clientId,
        clientData: {
          name: selectedClient.name || '',
          rfc: selectedClient.rfc || '',
          email: selectedClient.email || '',
          phone: selectedClient.phone || '',
          address: selectedClient.address || '',
          fiscalRegime: selectedClient.fiscal_regime || '612',
          cfdiUse: selectedClient.cfdi_use || 'G03'
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        clientId: clientId,
        clientData: {
          name: '',
          rfc: '',
          email: '',
          phone: '',
          address: '',
          fiscalRegime: '612',
          cfdiUse: 'G03'
        }
      }));
    }
  };

  const validateForm = () => {
    const errors = [];

    // Validar cliente
    if (!formData.clientData.name.trim()) errors.push('El nombre del cliente es requerido');
    if (!formData.clientData.rfc.trim()) errors.push('El RFC del cliente es requerido');
    if (!formData.clientData.email.trim()) errors.push('El email del cliente es requerido');

    // Validar serie
    if (!formData.serie) errors.push('Debe seleccionar una serie');

    // Validar items
    if (formData.items.length === 0) errors.push('Debe agregar al menos un concepto');
    
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) errors.push(`Descripción requerida en concepto ${index + 1}`);
      if (!item.quantity || item.quantity <= 0) errors.push(`Cantidad inválida en concepto ${index + 1}`);
      if (!item.price || item.price <= 0) errors.push(`Precio inválido en concepto ${index + 1}`);
    });

    // Validar lugar de expedición
    if (!formData.issuePlace.trim()) errors.push('El lugar de expedición es requerido');

    return errors;
  };

  const createClient = async () => {
    try {
      const clientData = {
        name: formData.clientData.name,
        rfc: formData.clientData.rfc,
        email: formData.clientData.email,
        phone: formData.clientData.phone,
        address: formData.clientData.address,
        fiscal_regime: formData.clientData.fiscalRegime,
        cfdi_use: formData.clientData.cfdiUse
      };

      const result = await CFDIService.createClient(clientData);
      return result.uid || result.id;
    } catch (error) {
      console.error('Error creating client:', error);
      throw new Error('Error al crear cliente: ' + error.message);
    }
  };

  const handleSubmit = async (isDraft = false) => {
    try {
      // Validar formulario
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        addNotification({
          type: 'error',
          message: 'Errores en el formulario: ' + validationErrors.join(', ')
        });
        return;
      }

      setLoading(true);

      let clientUID = formData.clientId;

      // Crear cliente si es nuevo
      if (!clientUID || clientUID === 'new') {
        clientUID = await createClient();
        addNotification({
          type: 'success',
          message: 'Cliente creado exitosamente'
        });
      }

      // Preparar datos del CFDI
      const selectedSeries = series.find(s => s.id === parseInt(formData.serie));
      const cfdiData = CFDIService.transformInvoiceToCFDI(
        {
          items: formData.items,
          cfdiUse: formData.clientData.cfdiUse,
          paymentForm: formData.paymentForm,
          paymentMethod: formData.paymentMethod,
          currency: formData.currency,
          sendEmail: formData.sendEmail,
          issuePlace: formData.issuePlace,
          notes: formData.notes,
          orderNumber: formData.orderNumber
        },
        { uid: clientUID },
        selectedSeries
      );

      // Agregar bandera de borrador si aplica
      if (isDraft) {
        cfdiData.Draft = "1";
      }

      // Crear CFDI
      const result = await CFDIService.createCFDI(cfdiData);

      addNotification({
        type: 'success',
        message: isDraft ? 'Borrador creado exitosamente' : 'CFDI creado exitosamente'
      });

      // Redirigir a la página de facturas
      navigate('/facturacion');

    } catch (error) {
      console.error('Error creating invoice:', error);
      addNotification({
        type: 'error',
        message: error.message || 'Error al crear la factura'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  if (loadingData) {
    return (
      <div className="invoice-create">
        <div className="loading-container">
          <div className="loading-spinner">Cargando datos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="invoice-create">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Crear Nueva Factura CFDI</h1>
          <p>Complete la información para generar un CFDI 4.0</p>
        </div>
        <div className="page-actions">
          <Button 
            variant="outline" 
            onClick={() => navigate('/facturacion')}
            disabled={loading}
          >
            ← Cancelar
          </Button>
        </div>
      </div>

      <form className="invoice-form">
        {/* Información del Cliente */}
        <div className="form-section">
          <h2 className="form-section-title">Información del Cliente/Receptor</h2>
          
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">Cliente Existente</label>
              <select
                value={formData.clientId}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="input"
              >
                <option value="">Seleccionar cliente existente...</option>
                <option value="new">+ Crear nuevo cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.rfc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid">
            <Input
              label="Nombre/Razón Social"
              type="text"
              value={formData.clientData.name}
              onChange={(e) => handleClientDataChange('name', e.target.value)}
              placeholder="Nombre completo o razón social"
              required
            />

            <Input
              label="RFC"
              type="text"
              value={formData.clientData.rfc}
              onChange={(e) => handleClientDataChange('rfc', e.target.value.toUpperCase())}
              placeholder="RFC del cliente"
              required
            />

            <Input
              label="Correo Electrónico"
              type="email"
              value={formData.clientData.email}
              onChange={(e) => handleClientDataChange('email', e.target.value)}
              placeholder="email@ejemplo.com"
              required
            />

            <Input
              label="Teléfono"
              type="tel"
              value={formData.clientData.phone}
              onChange={(e) => handleClientDataChange('phone', e.target.value)}
              placeholder="Teléfono del cliente"
            />

            <Input
              label="Dirección"
              type="text"
              value={formData.clientData.address}
              onChange={(e) => handleClientDataChange('address', e.target.value)}
              placeholder="Dirección completa"
              className="full-width"
            />

            <div className="input-group">
              <label className="input-label">Régimen Fiscal</label>
              <select
                value={formData.clientData.fiscalRegime}
                onChange={(e) => handleClientDataChange('fiscalRegime', e.target.value)}
                className="input"
              >
                <option value="612">Persona Física con Actividades Empresariales</option>
                <option value="601">General de Ley Personas Morales</option>
                <option value="603">Personas Morales con Fines no Lucrativos</option>
                <option value="605">Sueldos y Salarios e Ingresos Asimilados a Salarios</option>
                <option value="606">Arrendamiento</option>
                <option value="607">Régimen de Enajenación o Adquisición de Bienes</option>
                <option value="608">Demás ingresos</option>
                <option value="610">Residentes en el Extranjero sin Establecimiento Permanente en México</option>
                <option value="611">Ingresos por Dividendos (socios y accionistas)</option>
                <option value="614">Ingresos por intereses</option>
                <option value="615">Régimen de los ingresos por obtención de premios</option>
                <option value="616">Sin obligaciones fiscales</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Uso de CFDI</label>
              <select
                value={formData.clientData.cfdiUse}
                onChange={(e) => handleClientDataChange('cfdiUse', e.target.value)}
                className="input"
              >
                <option value="G01">Adquisición de mercancías</option>
                <option value="G02">Devoluciones, descuentos o bonificaciones</option>
                <option value="G03">Gastos en general</option>
                <option value="I01">Construcciones</option>
                <option value="I02">Mobilario y equipo de oficina por inversiones</option>
                <option value="I03">Equipo de transporte</option>
                <option value="I04">Equipo de cómputo y accesorios</option>
                <option value="I05">Dados, troqueles, moldes, matrices y herramental</option>
                <option value="I06">Comunicaciones telefónicas</option>
                <option value="I07">Comunicaciones satelitales</option>
                <option value="I08">Otra maquinaria y equipo</option>
                <option value="D01">Honorarios médicos, dentales y gastos hospitalarios</option>
                <option value="D02">Gastos médicos por incapacidad o discapacidad</option>
                <option value="D03">Gastos funerales</option>
                <option value="D04">Donativos</option>
                <option value="D05">Intereses reales efectivamente pagados por créditos hipotecarios</option>
                <option value="D06">Aportaciones voluntarias al SAR</option>
                <option value="D07">Primas por seguros de gastos médicos</option>
                <option value="D08">Gastos de transportación escolar obligatoria</option>
                <option value="D09">Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones</option>
                <option value="D10">Pagos por servicios educativos (colegiaturas)</option>
                <option value="P01">Por definir</option>
              </select>
            </div>
          </div>
        </div>

        {/* Información de la Factura */}
        <div className="form-section">
          <h2 className="form-section-title">Configuración de la Factura</h2>
          
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">Serie</label>
              <select
                value={formData.serie}
                onChange={(e) => handleInputChange('serie', e.target.value)}
                className="input"
                required
              >
                <option value="">Seleccionar serie...</option>
                {series.map(serie => (
                  <option key={serie.id} value={serie.id}>
                    Serie {serie.serie} - {serie.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Forma de Pago</label>
              <select
                value={formData.paymentForm}
                onChange={(e) => handleInputChange('paymentForm', e.target.value)}
                className="input"
              >
                <option value="01">Efectivo</option>
                <option value="02">Cheque nominativo</option>
                <option value="03">Transferencia electrónica de fondos</option>
                <option value="04">Tarjeta de crédito</option>
                <option value="05">Monedero electrónico</option>
                <option value="06">Dinero electrónico</option>
                <option value="08">Vales de despensa</option>
                <option value="12">Dación en pago</option>
                <option value="13">Pago por subrogación</option>
                <option value="14">Pago por consignación</option>
                <option value="15">Condonación</option>
                <option value="17">Compensación</option>
                <option value="23">Novación</option>
                <option value="24">Confusión</option>
                <option value="25">Remisión de deuda</option>
                <option value="26">Prescripción o caducidad</option>
                <option value="27">A satisfacción del acreedor</option>
                <option value="28">Tarjeta de débito</option>
                <option value="29">Tarjeta de servicios</option>
                <option value="30">Aplicación de anticipos</option>
                <option value="99">Por definir</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Método de Pago</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="input"
              >
                <option value="PUE">Pago en una sola exhibición</option>
                <option value="PPD">Pago en parcialidades o diferido</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Moneda</label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="input"
              >
                <option value="MXN">Peso Mexicano (MXN)</option>
                <option value="USD">Dólar Americano (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="XXX">Los códigos asignados para las transacciones en que intervenga ninguna moneda</option>
              </select>
            </div>

            <Input
              label="Lugar de Expedición (CP)"
              type="text"
              value={formData.issuePlace}
              onChange={(e) => handleInputChange('issuePlace', e.target.value)}
              placeholder="Código postal de expedición"
              maxLength="5"
              required
            />

            <Input
              label="Número de Orden (Opcional)"
              type="text"
              value={formData.orderNumber}
              onChange={(e) => handleInputChange('orderNumber', e.target.value)}
              placeholder="Número de orden interno"
            />

            <div className="input-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formData.sendEmail}
                  onChange={(e) => handleInputChange('sendEmail', e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-label">Enviar por correo electrónico</span>
              </label>
            </div>
          </div>
        </div>

        {/* Conceptos/Items */}
        <div className="form-section">
          <div className="section-header">
            <h2 className="form-section-title">Conceptos</h2>
            <Button type="button" variant="primary" onClick={addItem}>
              ➕ Agregar Concepto
            </Button>
          </div>

          <div className="items-container">
            {formData.items.map((item, index) => (
              <div key={item.id} className="item-row">
                <div className="item-grid">
                  <div className="item-description">
                    <Input
                      label="Descripción"
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      placeholder="Descripción del producto o servicio"
                      required
                    />
                  </div>

                  <Input
                    label="Cantidad"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.000001"
                    required
                  />

                  <div className="input-group">
                    <label className="input-label">Unidad</label>
                    <select
                      value={item.unitCode}
                      onChange={(e) => {
                        const selectedOption = e.target.selectedOptions[0];
                        handleItemChange(item.id, 'unitCode', e.target.value);
                        handleItemChange(item.id, 'unit', selectedOption.text.split(' - ')[1] || selectedOption.text);
                      }}
                      className="input"
                    >
                      <option value="E48">E48 - Unidad de servicio</option>
                      <option value="H87">H87 - Pieza</option>
                      <option value="KGM">KGM - Kilogramo</option>
                      <option value="LTR">LTR - Litro</option>
                      <option value="MTR">MTR - Metro</option>
                      <option value="MTK">MTK - Metro cuadrado</option>
                      <option value="MTQ">MTQ - Metro cúbico</option>
                      <option value="GRM">GRM - Gramo</option>
                      <option value="TON">TON - Tonelada</option>
                      <option value="HUR">HUR - Hora</option>
                      <option value="ACT">ACT - Actividad</option>
                      <option value="XPK">XPK - Paquete</option>
                      <option value="XBX">XBX - Caja</option>
                      <option value="XPP">XPP - Sobre</option>
                    </select>
                  </div>

                  <Input
                    label="Precio Unitario"
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.000001"
                    placeholder="0.00"
                    required
                  />

                  <Input
                    label="Descuento"
                    type="number"
                    value={item.discount}
                    onChange={(e) => handleItemChange(item.id, 'discount', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.000001"
                    placeholder="0.00"
                  />

                  <div className="item-actions">
                    {formData.items.length > 1 && (
                      <Button
                        type="button"
                        variant="error"
                        size="small"
                        onClick={() => removeItem(item.id)}
                        title="Eliminar concepto"
                      >
                        🗑️
                      </Button>
                    )}
                  </div>
                </div>

                <div className="form-grid" style={{ marginTop: 'var(--spacing-md)' }}>
                  <Input
                    label="Código SAT"
                    type="text"
                    value={item.satCode}
                    onChange={(e) => handleItemChange(item.id, 'satCode', e.target.value)}
                    placeholder="Código del catálogo SAT"
                    helperText="Busque en el catálogo oficial del SAT"
                  />

                  <Input
                    label="SKU/Código Interno"
                    type="text"
                    value={item.sku}
                    onChange={(e) => handleItemChange(item.id, 'sku', e.target.value)}
                    placeholder="Código interno del producto"
                  />
                </div>

                <div className="total-display">
                  Subtotal del concepto: {formatCurrency((item.quantity * item.price) - (item.discount || 0))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notas adicionales */}
        <div className="form-section">
          <h2 className="form-section-title">Información Adicional</h2>
          
          <div className="input-group">
            <label className="input-label">Comentarios/Notas</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="input textarea"
              rows="4"
              placeholder="Comentarios adicionales que aparecerán en el CFDI..."
            />
          </div>
        </div>

        {/* Resumen de totales */}
        <div className="totals-container">
          <div className="totals-grid">
            <div className="totals-left">
              <div className="calculation-summary">
                <h3>Resumen de Totales</h3>
                
                <div className="calculation-row">
                  <span className="calculation-label">Subtotal:</span>
                  <span className="calculation-value">{formatCurrency(calculations.subtotal)}</span>
                </div>
                
                {calculations.totalDiscount > 0 && (
                  <div className="calculation-row">
                    <span className="calculation-label">Descuentos:</span>
                    <span className="calculation-value text-error">-{formatCurrency(calculations.totalDiscount)}</span>
                  </div>
                )}
                
                <div className="calculation-row">
                  <span className="calculation-label">IVA (16%):</span>
                  <span className="calculation-value">{formatCurrency(calculations.tax)}</span>
                </div>
                
                <div className="calculation-row total-row">
                  <span className="calculation-label">Total:</span>
                  <span className="calculation-value">{formatCurrency(calculations.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones del formulario */}
        <div className="form-actions between">
          <div className="left-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/facturacion')}
              disabled={loading}
            >
              ← Cancelar
            </Button>
          </div>
          
          <div className="right-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSubmit(true)}
              loading={loading}
              disabled={loading}
            >
              💾 Guardar como Borrador
            </Button>
            
            <Button
              type="button"
              variant="primary"
              onClick={() => handleSubmit(false)}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Creando CFDI...' : '📄 Crear y Timbrar CFDI'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InvoiceCreate;