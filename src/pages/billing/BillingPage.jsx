import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { useAppContext } from '../../context/AppContext';

const BillingPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const { addNotification } = useAppContext();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockInvoices = [
        {
          id: 1,
          number: 'FAC-001',
          clientName: 'Empresa ABC C.A.',
          clientRif: 'J-12345678-9',
          clientEmail: 'contacto@empresaabc.com',
          issueDate: '2024-01-15',
          dueDate: '2024-02-15',
          subtotal: 85000,
          tax: 13600,
          total: 98600,
          status: 'pagada',
          paymentDate: '2024-01-28',
          items: [
            { description: 'Desarrollo de aplicación web', quantity: 1, price: 50000 },
            { description: 'Hosting y dominio anual', quantity: 1, price: 35000 }
          ]
        },
        {
          id: 2,
          number: 'FAC-002',
          clientName: 'Comercial XYZ S.R.L.',
          clientRif: 'J-23456789-0',
          clientEmail: 'admin@comercialxyz.com',
          issueDate: '2024-01-20',
          dueDate: '2024-02-20',
          subtotal: 120000,
          tax: 19200,
          total: 139200,
          status: 'pendiente',
          paymentDate: null,
          items: [
            { description: 'Sistema de gestión de inventario', quantity: 1, price: 80000 },
            { description: 'Capacitación del personal', quantity: 1, price: 40000 }
          ]
        },
        {
          id: 3,
          number: 'FAC-003',
          clientName: 'Servicios DEF C.A.',
          clientRif: 'J-34567890-1',
          clientEmail: 'facturacion@serviciosdef.com',
          issueDate: '2024-01-25',
          dueDate: '2024-02-25',
          subtotal: 75000,
          tax: 12000,
          total: 87000,
          status: 'vencida',
          paymentDate: null,
          items: [
            { description: 'Consultoría en sistemas', quantity: 20, price: 3750 }
          ]
        },
        {
          id: 4,
          number: 'FAC-004',
          clientName: 'Industrias GHI S.A.',
          clientRif: 'J-45678901-2',
          clientEmail: 'compras@industriasghi.com',
          issueDate: '2024-02-01',
          dueDate: '2024-03-01',
          subtotal: 200000,
          tax: 32000,
          total: 232000,
          status: 'borrador',
          paymentDate: null,
          items: [
            { description: 'Desarrollo de plataforma e-commerce', quantity: 1, price: 150000 },
            { description: 'Integración con API de pagos', quantity: 1, price: 50000 }
          ]
        },
        {
          id: 5,
          number: 'FAC-005',
          clientName: 'Consultoría JKL C.A.',
          clientRif: 'J-56789012-3',
          clientEmail: 'info@consultoriajkl.com',
          issueDate: '2024-02-05',
          dueDate: '2024-03-05',
          subtotal: 45000,
          tax: 7200,
          total: 52200,
          status: 'enviada',
          paymentDate: null,
          items: [
            { description: 'Mantenimiento de sitio web', quantity: 3, price: 15000 }
          ]
        }
      ];
      
      setInvoices(mockInvoices);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al cargar facturas'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesFilter = filter === 'todas' || invoice.status === filter;
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientRif.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'borrador': { class: 'status-draft', text: 'Borrador' },
      'enviada': { class: 'status-sent', text: 'Enviada' },
      'pagada': { class: 'status-paid', text: 'Pagada' },
      'pendiente': { class: 'status-pending', text: 'Pendiente' },
      'vencida': { class: 'status-overdue', text: 'Vencida' },
      'cancelada': { class: 'status-cancelled', text: 'Cancelada' }
    };

    const config = statusConfig[status] || statusConfig['borrador'];
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'pagada' || status === 'cancelada') return false;
    return new Date(dueDate) < new Date();
  };

  const handleDeleteInvoice = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta factura?')) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setInvoices(invoices.filter(inv => inv.id !== id));
        addNotification({
          type: 'success',
          message: 'Factura eliminada exitosamente'
        });
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Error al eliminar factura'
        });
      }
    }
  };

  const handleDuplicateInvoice = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const original = invoices.find(inv => inv.id === id);
      const duplicate = {
        ...original,
        id: invoices.length + 1,
        number: `FAC-${String(invoices.length + 1).padStart(3, '0')}`,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'borrador',
        paymentDate: null
      };
      
      setInvoices([...invoices, duplicate]);
      addNotification({
        type: 'success',
        message: 'Factura duplicada exitosamente'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al duplicar factura'
      });
    }
  };

  const handleSendInvoice = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInvoices(invoices.map(inv => 
        inv.id === id ? { ...inv, status: 'enviada' } : inv
      ));
      
      addNotification({
        type: 'success',
        message: 'Factura enviada exitosamente'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al enviar factura'
      });
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInvoices(invoices.map(inv => 
        inv.id === id ? { 
          ...inv, 
          status: 'pagada', 
          paymentDate: new Date().toISOString().split('T')[0] 
        } : inv
      ));
      
      addNotification({
        type: 'success',
        message: 'Factura marcada como pagada'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al actualizar estado'
      });
    }
  };

  const calculateStats = () => {
    const total = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const paid = filteredInvoices.filter(inv => inv.status === 'pagada').reduce((sum, inv) => sum + inv.total, 0);
    const pending = filteredInvoices.filter(inv => inv.status === 'pendiente' || inv.status === 'enviada').reduce((sum, inv) => sum + inv.total, 0);
    const overdue = filteredInvoices.filter(inv => inv.status === 'vencida').reduce((sum, inv) => sum + inv.total, 0);
    
    return { total, paid, pending, overdue };
  };

  const stats = calculateStats();

  if (loading) {
    return <Loading text="Cargando facturas..." />;
  }

  return (
    <div className="billing-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Gestión de Facturación</h1>
          <p>Administra todas las facturas y pagos</p>
        </div>
        <div className="page-actions">
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
              ➕ Nueva Factura
            </Button>
          </Link>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Buscar por número, cliente o RIF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="status-filter">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="todas">Todos los estados</option>
            <option value="borrador">Borradores</option>
            <option value="enviada">Enviadas</option>
            <option value="pendiente">Pendientes</option>
            <option value="pagada">Pagadas</option>
            <option value="vencida">Vencidas</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>
      </div>

      <div className="billing-stats">
        <div className="stat-card stat-card-blue">
          <h3>Total Facturas</h3>
          <p className="stat-value">{invoices.length}</p>
          <p className="stat-amount">{formatCurrency(stats.total)}</p>
        </div>
        <div className="stat-card stat-card-green">
          <h3>Pagadas</h3>
          <p className="stat-value">{invoices.filter(i => i.status === 'pagada').length}</p>
          <p className="stat-amount">{formatCurrency(stats.paid)}</p>
        </div>
        <div className="stat-card stat-card-orange">
          <h3>Pendientes</h3>
          <p className="stat-value">{invoices.filter(i => i.status === 'pendiente' || i.status === 'enviada').length}</p>
          <p className="stat-amount">{formatCurrency(stats.pending)}</p>
        </div>
        <div className="stat-card stat-card-red">
          <h3>Vencidas</h3>
          <p className="stat-value">{invoices.filter(i => i.status === 'vencida').length}</p>
          <p className="stat-amount">{formatCurrency(stats.overdue)}</p>
        </div>
      </div>

      <div className="invoice-table-container">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente</th>
              <th>Fecha Emisión</th>
              <th>Fecha Vencimiento</th>
              <th>Subtotal</th>
              <th>IVA</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className={isOverdue(invoice.dueDate, invoice.status) ? 'row-overdue' : ''}>
                  <td>
                    <div className="invoice-number">
                      <strong>{invoice.number}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="client-cell">
                      <strong>{invoice.clientName}</strong>
                      <small>{invoice.clientRif}</small>
                    </div>
                  </td>
                  <td>{formatDate(invoice.issueDate)}</td>
                  <td className={isOverdue(invoice.dueDate, invoice.status) ? 'text-error' : ''}>
                    {formatDate(invoice.dueDate)}
                    {isOverdue(invoice.dueDate, invoice.status) && (
                      <small className="overdue-indicator">⚠️ Vencida</small>
                    )}
                  </td>
                  <td className="currency">{formatCurrency(invoice.subtotal)}</td>
                  <td className="currency">{formatCurrency(invoice.tax)}</td>
                  <td className="currency font-bold">{formatCurrency(invoice.total)}</td>
                  <td>{getStatusBadge(invoice.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/facturacion/editar/${invoice.id}`}>
                        <Button size="small" variant="outline" title="Editar">
                          ✏️
                        </Button>
                      </Link>
                      <Button 
                        size="small" 
                        variant="outline"
                        onClick={() => handleDuplicateInvoice(invoice.id)}
                        title="Duplicar"
                      >
                        📋
                      </Button>
                      {invoice.status === 'borrador' && (
                        <Button 
                          size="small" 
                          variant="primary"
                          onClick={() => handleSendInvoice(invoice.id)}
                          title="Enviar"
                        >
                          📧
                        </Button>
                      )}
                      {(invoice.status === 'enviada' || invoice.status === 'pendiente' || invoice.status === 'vencida') && (
                        <Button 
                          size="small" 
                          variant="success"
                          onClick={() => handleMarkAsPaid(invoice.id)}
                          title="Marcar como pagada"
                        >
                          ✅
                        </Button>
                      )}
                      <Button 
                        size="small" 
                        variant="error"
                        onClick={() => handleDeleteInvoice(invoice.id)}
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
        <h3>Acciones Rápidas</h3>
        <div className="quick-actions-grid">
          <div className="quick-action-card">
            <h4> Enviar Recordatorios</h4>
            <p>Enviar recordatorios de pago a facturas vencidas</p>
            <Button variant="outline" size="small">
              Enviar Recordatorios
            </Button>
          </div>
          <div className="quick-action-card">
            <h4> Generar Reporte</h4>
            <p>Crear reporte de facturación del período</p>
            <Button variant="outline" size="small">
              Generar Reporte
            </Button>
          </div>
          <div className="quick-action-card">
            <h4> Exportar Datos</h4>
            <p>Exportar facturas en formato Excel o PDF</p>
            <Button variant="outline" size="small">
              Exportar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;