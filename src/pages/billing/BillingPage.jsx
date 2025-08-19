// src/pages/billing/BillingPage.jsx - Actualizada con descargas de PDF/XML
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { useAppContext } from '../../context/AppContext';
import BillingService from '../../services/billingService';
import CFDIService from '../../services/cfdiService';

const BillingPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [filter, setFilter] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const { addNotification } = useAppContext();

  useEffect(() => {
    loadInvoices();
  }, [filter, searchTerm, dateFilter]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      
      // Intentar cargar CFDIs reales desde la API
      let result;
      try {
        // Primero intentamos cargar CFDIs del mes actual
        result = await CFDIService.listCFDIs({
          month: String(dateFilter.month).padStart(2, '0'),
          year: dateFilter.year.toString(),
          per_page: 100
        });
        
        // Si no hay resultados, intentamos cargar los últimos 6 meses
        if (!result.data || result.data.length === 0) {
          result = await CFDIService.getRecentCFDIs(6);
        }
        
        if (result.data && Array.isArray(result.data)) {
          // Transformar los datos de la API al formato esperado
          const transformedInvoices = result.data.map(cfdi => ({
            id: cfdi.UID || cfdi.ID,
            uuid: cfdi.UUID,
            number: `${cfdi.Serie || 'F'}-${cfdi.Folio}`,
            serie: cfdi.Serie || 'F',
            folio: cfdi.Folio,
            clientName: cfdi.RazonSocialReceptor || cfdi.NombreReceptor || 'Cliente',
            clientRfc: cfdi.Receptor || 'RFC000000000',
            clientEmail: cfdi.EmailReceptor || '',
            issueDate: cfdi.FechaTimbrado || cfdi.Fecha || new Date().toISOString().split('T')[0],
            dueDate: cfdi.FechaVencimiento || null,
            subtotal: parseFloat(cfdi.SubTotal || 0),
            tax: parseFloat(cfdi.TotalImpuestosTrasladados || 0),
            total: parseFloat(cfdi.Total || 0),
            status: cfdi.Status?.toLowerCase() || 'borrador',
            paymentDate: cfdi.FechaPago || null,
            satStatus: cfdi.EstatusSAT || 'vigente',
            items: cfdi.Conceptos || []
          }));
          
          setInvoices(transformedInvoices);
        } else {
          // Si no hay datos, usar datos mock para desarrollo
          setInvoices(getMockInvoices());
        }
      } catch (apiError) {
        console.warn('Error loading from API, using mock data:', apiError);
        // Fallback a datos mock
        setInvoices(getMockInvoices());
      }
      
    } catch (error) {
      console.error('Error loading invoices:', error);
      addNotification({
        type: 'error',
        message: 'Error al cargar facturas: ' + error.message
      });
      
      // Fallback a datos mock en caso de error
      setInvoices(getMockInvoices());
    } finally {
      setLoading(false);
    }
  };

  const getMockInvoices = () => {
    return [
      {
        id: '1',
        uuid: '8ff503a2-c6b7-4a25-92c7-a25610e6b488',
        number: 'F-001',
        serie: 'F',
        folio: '001',
        clientName: 'Empresa ABC S.A. de C.V.',
        clientRfc: 'ABC123456789',
        clientEmail: 'contacto@empresaabc.com',
        issueDate: '2024-01-15',
        dueDate: '2024-02-15',
        subtotal: 85000,
        tax: 13600,
        total: 98600,
        status: 'timbrada',
        paymentDate: null,
        satStatus: 'vigente',
        items: [
          { description: 'Desarrollo de aplicación web', quantity: 1, price: 50000 },
          { description: 'Hosting y dominio anual', quantity: 1, price: 35000 }
        ]
      },
      {
        id: '2',
        uuid: '7ae402b1-c5a6-3b24-81c6-b14509e5a387',
        number: 'F-002',
        serie: 'F',
        folio: '002',
        clientName: 'Comercial XYZ S.R.L.',
        clientRfc: 'XYZ987654321',
        clientEmail: 'admin@comercialxyz.com',
        issueDate: '2024-01-20',
        dueDate: '2024-02-20',
        subtotal: 120000,
        tax: 19200,
        total: 139200,
        status: 'borrador',
        paymentDate: null,
        satStatus: 'no_timbrada',
        items: [
          { description: 'Sistema de gestión de inventario', quantity: 1, price: 80000 },
          { description: 'Capacitación del personal', quantity: 1, price: 40000 }
        ]
      },
      {
        id: '3',
        uuid: '9bf504c3-d7c8-5d35-92d8-b36621f7c499',
        number: 'F-003',
        serie: 'F',
        folio: '003',
        clientName: 'Distribuidora DEF S.A.',
        clientRfc: 'DEF456789012',
        clientEmail: 'ventas@def.com',
        issueDate: '2024-01-25',
        dueDate: '2024-02-25',
        subtotal: 75000,
        tax: 12000,
        total: 87000,
        status: 'enviada',
        paymentDate: null,
        satStatus: 'vigente',
        items: [
          { description: 'Consultoría empresarial', quantity: 1, price: 75000 }
        ]
      }
    ];
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesFilter = filter === 'todas' || invoice.status === filter;
    const matchesSearch = searchTerm === '' || 
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientRfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.uuid && invoice.uuid.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const setItemLoading = (itemId, isLoading) => {
    setActionLoading(prev => ({
      ...prev,
      [itemId]: isLoading
    }));
  };

  const handleCancelInvoice = async (invoice) => {
    if (!invoice.uuid) {
      addNotification({
        type: 'error',
        message: 'No se puede cancelar: UUID no disponible'
      });
      return;
    }

    const reasons = {
      '01': 'Comprobante emitido con errores con relación',
      '02': 'Comprobante emitido con errores sin relación',
      '03': 'No se llevó a cabo la operación',
      '04': 'Operación nominativa relacionada en una factura global'
    };

    const reason = window.prompt(
      `Seleccione el motivo de cancelación:\n${Object.entries(reasons).map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nIngrese el código (01-04):`,
      '02'
    );

    if (!reason || !reasons[reason]) {
      return;
    }

    if (!window.confirm(`¿Está seguro de cancelar la factura ${invoice.number}?`)) {
      return;
    }

    try {
      setItemLoading(invoice.id, true);
      
      await CFDIService.cancelCFDI(invoice.uuid, reason);
      
      addNotification({
        type: 'success',
        message: 'Factura cancelada exitosamente'
      });
      
      loadInvoices();
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al cancelar factura: ' + error.message
      });
    } finally {
      setItemLoading(invoice.id, false);
    }
  };

  const handleSendByEmail = async (invoice) => {
    if (!invoice.uuid) {
      addNotification({
        type: 'error',
        message: 'No se puede enviar: UUID no disponible'
      });
      return;
    }

    const email = window.prompt(
      'Ingrese el email de destino:',
      invoice.clientEmail
    );

    if (!email) {
      return;
    }

    try {
      setItemLoading(invoice.id, true);
      
      await CFDIService.sendCFDIByEmail(invoice.uuid, email);
      
      addNotification({
        type: 'success',
        message: `Factura enviada exitosamente a ${email}`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al enviar factura: ' + error.message
      });
    } finally {
      setItemLoading(invoice.id, false);
    }
  };

  // FUNCIÓN ACTUALIZADA: Descargar PDF usando CFDIService
  const handleDownloadPDF = async (invoice) => {
    if (!invoice.uuid) {
      addNotification({
        type: 'error',
        message: 'No se puede descargar: UUID no disponible'
      });
      return;
    }

    try {
      setItemLoading(invoice.id, true);
      
      // Usar CFDIService en lugar de BillingService
      const pdfBlob = await CFDIService.getCFDIPDF(invoice.uuid);
      const filename = `CFDI_${invoice.number}.pdf`;
      
      // Crear URL y descargar
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      addNotification({
        type: 'success',
        message: 'PDF descargado exitosamente'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al descargar PDF: ' + error.message
      });
    } finally {
      setItemLoading(invoice.id, false);
    }
  };

  // FUNCIÓN ACTUALIZADA: Descargar XML usando CFDIService
  const handleDownloadXML = async (invoice) => {
    if (!invoice.uuid) {
      addNotification({
        type: 'error',
        message: 'No se puede descargar: UUID no disponible'
      });
      return;
    }

    try {
      setItemLoading(invoice.id, true);
      
      // Usar CFDIService en lugar de BillingService
      const xmlContent = await CFDIService.getCFDIXML(invoice.uuid);
      const filename = `CFDI_${invoice.number}.xml`;
      
      // Crear blob para XML y descargar
      const xmlBlob = new Blob([xmlContent], { type: 'application/xml' });
      const url = window.URL.createObjectURL(xmlBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      addNotification({
        type: 'success',
        message: 'XML descargado exitosamente'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al descargar XML: ' + error.message
      });
    } finally {
      setItemLoading(invoice.id, false);
    }
  };

  // NUEVA FUNCIÓN: Ver PDF en nueva ventana
  const handleViewPDF = async (invoice) => {
    if (!invoice.uuid) {
      addNotification({
        type: 'error',
        message: 'No se puede ver: UUID no disponible'
      });
      return;
    }

    try {
      setItemLoading(invoice.id, true);
      
      const pdfBlob = await CFDIService.getCFDIPDF(invoice.uuid);
      const pdfUrl = window.URL.createObjectURL(pdfBlob);
      
      // Abrir en nueva ventana
      window.open(pdfUrl, '_blank');
      
      // Limpiar URL después de un tiempo
      setTimeout(() => {
        window.URL.revokeObjectURL(pdfUrl);
      }, 10000);
      
      addNotification({
        type: 'success',
        message: 'PDF abierto en nueva ventana'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al abrir PDF: ' + error.message
      });
    } finally {
      setItemLoading(invoice.id, false);
    }
  };

  const getStatusBadge = (status, satStatus) => {
    const statusDisplay = BillingService.getStatusDisplay(status);
    
    return (
      <div className="status-container">
        <span className={`status-badge ${statusDisplay.class}`}>
          {statusDisplay.text}
        </span>
        {satStatus && (
          <small className="sat-status">
            SAT: {satStatus === 'vigente' ? '✅ Vigente' : '❌ No vigente'}
          </small>
        )}
      </div>
    );
  };

  const formatCurrency = (amount) => {
    return BillingService.formatCurrency(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const calculateStats = () => {
    const total = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const timbradas = filteredInvoices.filter(inv => inv.status === 'timbrada');
    const borradores = filteredInvoices.filter(inv => inv.status === 'borrador');
    const canceladas = filteredInvoices.filter(inv => inv.status === 'cancelada');
    
    return {
      total: filteredInvoices.length,
      totalAmount: total,
      timbradas: timbradas.length,
      timbradasAmount: timbradas.reduce((sum, inv) => sum + inv.total, 0),
      borradores: borradores.length,
      canceladas: canceladas.length
    };
  };

  const handleRefresh = () => {
    loadInvoices();
  };

  const stats = calculateStats();

  if (loading) {
    return <Loading text="Cargando facturas..." />;
  }

  return (
    <div className="billing-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Gestión de Facturación CFDI</h1>
          <p>Administra todas las facturas electrónicas y CFDIs generados</p>
        </div>
        <div className="page-actions">
          <Button variant="outline" onClick={handleRefresh}>
            🔄 Actualizar
          </Button>
          <Link to="/clientes">
            <Button variant="outline">
              👥 Gestionar Clientes
            </Button>
          </Link>
          <Link to="/facturacion/reportes">
            <Button variant="outline">
              📊 Reportes
            </Button>
          </Link>
          <Link to="/facturacion/crear">
            <Button variant="primary">
              ➕ Nueva Factura CFDI
            </Button>
          </Link>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Buscar por número, cliente, RFC o UUID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="date-filter">
          <select
            value={dateFilter.month}
            onChange={(e) => setDateFilter(prev => ({ ...prev, month: parseInt(e.target.value) }))}
            className="filter-select"
          >
            <option value={1}>Enero</option>
            <option value={2}>Febrero</option>
            <option value={3}>Marzo</option>
            <option value={4}>Abril</option>
            <option value={5}>Mayo</option>
            <option value={6}>Junio</option>
            <option value={7}>Julio</option>
            <option value={8}>Agosto</option>
            <option value={9}>Septiembre</option>
            <option value={10}>Octubre</option>
            <option value={11}>Noviembre</option>
            <option value={12}>Diciembre</option>
          </select>
        </div>
        <div className="date-filter">
          <select
            value={dateFilter.year}
            onChange={(e) => setDateFilter(prev => ({ ...prev, year: parseInt(e.target.value) }))}
            className="filter-select"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>
        <div className="status-filter">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="todas">Todos los estados</option>
            <option value="borrador">Borradores</option>
            <option value="timbrada">Timbradas</option>
            <option value="enviada">Enviadas</option>
            <option value="pagada">Pagadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>
      </div>

      <div className="billing-stats">
        <div className="stat-card stat-card-blue">
          <h3>Total Facturas</h3>
          <p className="stat-value">{stats.total}</p>
          <p className="stat-amount">{formatCurrency(stats.totalAmount)}</p>
        </div>
        <div className="stat-card stat-card-green">
          <h3>Timbradas</h3>
          <p className="stat-value">{stats.timbradas}</p>
          <p className="stat-amount">{formatCurrency(stats.timbradasAmount)}</p>
        </div>
        <div className="stat-card stat-card-orange">
          <h3>Borradores</h3>
          <p className="stat-value">{stats.borradores}</p>
          <p className="stat-amount">Pendientes de timbrar</p>
        </div>
        <div className="stat-card stat-card-red">
          <h3>Canceladas</h3>
          <p className="stat-value">{stats.canceladas}</p>
          <p className="stat-amount">Sin valor fiscal</p>
        </div>
      </div>

      <div className="invoice-table-container">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Folio</th>
              <th>Cliente</th>
              <th>Fecha Emisión</th>
              <th>Subtotal</th>
              <th>IVA</th>
              <th>Total</th>
              <th>Estado</th>
              <th>UUID</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <div className="invoice-number">
                      <strong>{invoice.number}</strong>
                      <small>Serie: {invoice.serie}</small>
                    </div>
                  </td>
                  <td>
                    <div className="client-cell">
                      <strong>{invoice.clientName}</strong>
                      <small>{invoice.clientRfc}</small>
                    </div>
                  </td>
                  <td>{formatDate(invoice.issueDate)}</td>
                  <td className="currency">{formatCurrency(invoice.subtotal)}</td>
                  <td className="currency">{formatCurrency(invoice.tax)}</td>
                  <td className="currency font-bold">{formatCurrency(invoice.total)}</td>
                  <td>{getStatusBadge(invoice.status, invoice.satStatus)}</td>
                  <td>
                    <div className="uuid-cell">
                      {invoice.uuid ? (
                        <small className="uuid-text" title={invoice.uuid}>
                          {invoice.uuid.substring(0, 8)}...
                        </small>
                      ) : (
                        <small className="no-uuid">Sin UUID</small>
                      )}
                    </div>
                  </td>
                  // Reemplaza la sección de botones de acción en tu BillingPage.jsx:

<td>
  <div className="action-buttons">
    {/* Ver detalle */}
    <Link to={`/facturacion/detalle/${invoice.uuid || invoice.id}`}>
      <Button size="small" variant="outline" title="Ver detalle">
        👁️
      </Button>
    </Link>

    {/* Ver PDF en nueva ventana - ACTUALIZADO: incluye 'enviada' */}
    {invoice.uuid && (invoice.status === 'timbrada' || invoice.status === 'enviada') && (
      <Button 
        size="small" 
        variant="outline"
        onClick={() => handleViewPDF(invoice)}
        loading={actionLoading[invoice.id]}
        disabled={actionLoading[invoice.id]}
        title="Ver PDF"
      >
        👁️📄
      </Button>
    )}

    {/* Editar solo borradores */}
    {invoice.status === 'borrador' && (
      <Link to={`/facturacion/editar/${invoice.id}`}>
        <Button size="small" variant="outline" title="Editar">
          ✏️
        </Button>
      </Link>
    )}

    {/* Enviar por email - ACTUALIZADO: incluye 'enviada' */}
    {(invoice.status === 'timbrada' || invoice.status === 'enviada') && (
      <Button 
        size="small" 
        variant="primary"
        onClick={() => handleSendByEmail(invoice)}
        loading={actionLoading[invoice.id]}
        disabled={actionLoading[invoice.id]}
        title="Enviar por email"
      >
        📧
      </Button>
    )}

    {/* Descargar PDF - ACTUALIZADO: incluye 'enviada' */}
    {invoice.uuid && (invoice.status === 'timbrada' || invoice.status === 'enviada') && (
      <Button 
        size="small" 
        variant="outline"
        onClick={() => handleDownloadPDF(invoice)}
        loading={actionLoading[invoice.id]}
        disabled={actionLoading[invoice.id]}
        title="Descargar PDF"
      >
        📄
      </Button>
    )}

    {/* Descargar XML - ACTUALIZADO: incluye 'enviada' */}
    {invoice.uuid && (invoice.status === 'timbrada' || invoice.status === 'enviada') && (
      <Button 
        size="small" 
        variant="outline"
        onClick={() => handleDownloadXML(invoice)}
        loading={actionLoading[invoice.id]}
        disabled={actionLoading[invoice.id]}
        title="Descargar XML"
      >
        📑
      </Button>
    )}

    {/* Cancelar */}
    {(invoice.status === 'timbrada' || invoice.status === 'enviada') && (
      <Button 
        size="small" 
        variant="error"
        onClick={() => handleCancelInvoice(invoice)}
        loading={actionLoading[invoice.id]}
        disabled={actionLoading[invoice.id]}
        title="Cancelar CFDI"
      >
        ❌
      </Button>
    )}
  </div>
</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  {searchTerm || filter !== 'todas' ? 
                    'No se encontraron facturas con los filtros aplicados' : 
                    'No hay facturas registradas'
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="quick-actions-section">
        <h3>Herramientas CFDI</h3>
        <div className="quick-actions-grid">
          <div className="quick-action-card">
            <h4>🔍 Validar CFDI</h4>
            <p>Verificar estatus de CFDIs en el SAT</p>
            <Button variant="outline" size="small">
              Validar CFDIs
            </Button>
          </div>
          <div className="quick-action-card">
            <h4>📊 Reporte de Ventas</h4>
            <p>Generar reporte de facturación del período</p>
            <Button variant="outline" size="small">
              Generar Reporte
            </Button>
          </div>
          <div className="quick-action-card">
            <h4>📤 Exportar Datos</h4>
            <p>Exportar facturas en formato Excel o PDF</p>
            <Button variant="outline" size="small">
              Exportar
            </Button>
          </div>
          <div className="quick-action-card">
            <h4>⚙️ Configurar Series</h4>
            <p>Gestionar series y folios de facturación</p>
            <Button variant="outline" size="small">
              Configurar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;