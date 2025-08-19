// src/pages/gastos/GastosPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { useAppContext } from '../../context/AppContext';

const GastosPage = () => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const { addNotification } = useAppContext();

  useEffect(() => {
    loadGastos();
  }, [filter, searchTerm, dateFilter]);

  const loadGastos = async () => {
    try {
      setLoading(true);
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockGastos = [
        {
          id: 1,
          concepto: 'Material de oficina',
          descripcion: 'Compra de papelería y suministros',
          monto: 15000,
          solicitante: 'María González',
          categoria: 'Suministros',
          fecha: '2024-01-15',
          fechaSolicitud: '2024-01-14',
          autorizadoPor: 'Carlos López',
          status: 'aprobado',
          comprobante: 'FAC-2024-001.pdf',
          proveedor: 'Papelería Central'
        },
        {
          id: 2,
          concepto: 'Mantenimiento de equipos',
          descripcion: 'Servicio técnico para computadoras',
          monto: 45000,
          solicitante: 'Juan Pérez',
          categoria: 'Mantenimiento',
          fecha: '2024-01-18',
          fechaSolicitud: '2024-01-16',
          autorizadoPor: 'Ana Martínez',
          status: 'pendiente',
          comprobante: null,
          proveedor: 'TechService S.A.'
        },
        {
          id: 3,
          concepto: 'Combustible vehículos',
          descripcion: 'Gasolina para vehículos de la empresa',
          monto: 25000,
          solicitante: 'Luis Rodríguez',
          categoria: 'Transporte',
          fecha: '2024-01-20',
          fechaSolicitud: '2024-01-19',
          autorizadoPor: 'Carlos López',
          status: 'pagado',
          comprobante: 'REC-2024-003.pdf',
          proveedor: 'Estación de Servicio Norte'
        },
        {
          id: 4,
          concepto: 'Publicidad digital',
          descripcion: 'Campaña publicitaria en redes sociales',
          monto: 80000,
          solicitante: 'Ana Martínez',
          categoria: 'Marketing',
          fecha: '2024-01-22',
          fechaSolicitud: '2024-01-20',
          autorizadoPor: 'Carlos López',
          status: 'rechazado',
          comprobante: null,
          proveedor: 'Digital Marketing Pro',
          motivoRechazo: 'Presupuesto excedido para este mes'
        },
        {
          id: 5,
          concepto: 'Servicios legales',
          descripcion: 'Consultoría jurídica para contratos',
          monto: 120000,
          solicitante: 'Carlos López',
          categoria: 'Servicios Profesionales',
          fecha: '2024-01-25',
          fechaSolicitud: '2024-01-24',
          autorizadoPor: 'Director General',
          status: 'aprobado',
          comprobante: 'FAC-2024-005.pdf',
          proveedor: 'Bufete Jurídico Asociados'
        }
      ];
      
      setGastos(mockGastos);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al cargar gastos'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredGastos = gastos.filter(gasto => {
    const matchesFilter = filter === 'todos' || gasto.status === filter;
    const matchesSearch = searchTerm === '' || 
      gasto.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gasto.solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gasto.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gasto.proveedor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pendiente': { class: 'status-pending', text: 'Pendiente' },
      'aprobado': { class: 'status-approved', text: 'Aprobado' },
      'pagado': { class: 'status-paid', text: 'Pagado' },
      'rechazado': { class: 'status-rejected', text: 'Rechazado' }
    };

    const config = statusConfig[status] || statusConfig['pendiente'];
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const calculateStats = () => {
    const total = filteredGastos.reduce((sum, gasto) => sum + gasto.monto, 0);
    const aprobados = filteredGastos.filter(g => g.status === 'aprobado');
    const pagados = filteredGastos.filter(g => g.status === 'pagado');
    const pendientes = filteredGastos.filter(g => g.status === 'pendiente');
    
    return {
      total: filteredGastos.length,
      totalMonto: total,
      aprobados: aprobados.length,
      aprobadosMonto: aprobados.reduce((sum, g) => sum + g.monto, 0),
      pagados: pagados.length,
      pagadosMonto: pagados.reduce((sum, g) => sum + g.monto, 0),
      pendientes: pendientes.length
    };
  };

  const handleDeleteGasto = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este gasto?')) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setGastos(gastos.filter(g => g.id !== id));
        addNotification({
          type: 'success',
          message: 'Gasto eliminado exitosamente'
        });
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Error al eliminar gasto'
        });
      }
    }
  };

  const handleChangeStatus = async (id, newStatus) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setGastos(gastos.map(g => 
        g.id === id ? { ...g, status: newStatus } : g
      ));
      addNotification({
        type: 'success',
        message: `Gasto ${newStatus} exitosamente`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al actualizar estado'
      });
    }
  };

  const stats = calculateStats();

  if (loading) {
    return <Loading text="Cargando gastos..." />;
  }

  return (
    <div className="gastos-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Gestión de Gastos</h1>
          <p>Administra todos los gastos y solicitudes de la empresa</p>
        </div>
        <div className="page-actions">
          <Button variant="outline" onClick={() => window.location.reload()}>
            🔄 Actualizar
          </Button>
          <Link to="/gastos/categorias">
            <Button variant="outline">
              🏷️ Categorías
            </Button>
          </Link>
          <Link to="/gastos/reportes">
            <Button variant="outline">
              📊 Reportes
            </Button>
          </Link>
          <Link to="/gastos/crear">
            <Button variant="primary">
              ➕ Nuevo Gasto
            </Button>
          </Link>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Buscar por concepto, solicitante, categoría o proveedor..."
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
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="aprobado">Aprobados</option>
            <option value="pagado">Pagados</option>
            <option value="rechazado">Rechazados</option>
          </select>
        </div>
      </div>

      <div className="gastos-stats">
        <div className="stat-card stat-card-blue">
          <h3>Total Gastos</h3>
          <p className="stat-value">{stats.total}</p>
          <p className="stat-amount">{formatCurrency(stats.totalMonto)}</p>
        </div>
        <div className="stat-card stat-card-green">
          <h3>Pagados</h3>
          <p className="stat-value">{stats.pagados}</p>
          <p className="stat-amount">{formatCurrency(stats.pagadosMonto)}</p>
        </div>
        <div className="stat-card stat-card-orange">
          <h3>Pendientes</h3>
          <p className="stat-value">{stats.pendientes}</p>
          <p className="stat-amount">Por aprobar</p>
        </div>
        <div className="stat-card stat-card-purple">
          <h3>Aprobados</h3>
          <p className="stat-value">{stats.aprobados}</p>
          <p className="stat-amount">{formatCurrency(stats.aprobadosMonto)}</p>
        </div>
      </div>

      <div className="gastos-table-container">
        <table className="gastos-table">
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Solicitante</th>
              <th>Categoría</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Autorizado por</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredGastos.length > 0 ? (
              filteredGastos.map((gasto) => (
                <tr key={gasto.id}>
                  <td>
                    <div className="gasto-concept">
                      <strong>{gasto.concepto}</strong>
                      <small>{gasto.descripcion}</small>
                      {gasto.proveedor && (
                        <small className="proveedor">Proveedor: {gasto.proveedor}</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="solicitante-cell">
                      <strong>{gasto.solicitante}</strong>
                      <small>Solicitado: {formatDate(gasto.fechaSolicitud)}</small>
                    </div>
                  </td>
                  <td>
                    <span className="categoria-badge">{gasto.categoria}</span>
                  </td>
                  <td className="currency font-bold">{formatCurrency(gasto.monto)}</td>
                  <td>{formatDate(gasto.fecha)}</td>
                  <td>{gasto.autorizadoPor}</td>
                  <td>{getStatusBadge(gasto.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/gastos/editar/${gasto.id}`}>
                        <Button size="small" variant="outline" title="Editar">
                          ✏️
                        </Button>
                      </Link>
                      
                      {gasto.status === 'pendiente' && (
                        <>
                          <Button 
                            size="small" 
                            variant="success"
                            onClick={() => handleChangeStatus(gasto.id, 'aprobado')}
                            title="Aprobar"
                          >
                            ✅
                          </Button>
                          <Button 
                            size="small" 
                            variant="error"
                            onClick={() => handleChangeStatus(gasto.id, 'rechazado')}
                            title="Rechazar"
                          >
                            ❌
                          </Button>
                        </>
                      )}
                      
                      {gasto.status === 'aprobado' && (
                        <Button 
                          size="small" 
                          variant="primary"
                          onClick={() => handleChangeStatus(gasto.id, 'pagado')}
                          title="Marcar como pagado"
                        >
                          💰
                        </Button>
                      )}
                      
                      {gasto.comprobante && (
                        <Button 
                          size="small" 
                          variant="outline"
                          onClick={() => window.open(`/uploads/${gasto.comprobante}`, '_blank')}
                          title="Ver comprobante"
                        >
                          📄
                        </Button>
                      )}
                      
                      <Button 
                        size="small" 
                        variant="error"
                        onClick={() => handleDeleteGasto(gasto.id)}
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
                <td colSpan="8" className="no-data">
                  {searchTerm || filter !== 'todos' ? 
                    'No se encontraron gastos con los filtros aplicados' : 
                    'No hay gastos registrados'
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="quick-actions-section">
        <h3>Herramientas de Gastos</h3>
        <div className="quick-actions-grid">
          <div className="quick-action-card">
            <h4>📋 Solicitudes Pendientes</h4>
            <p>Revisar y aprobar solicitudes de gastos</p>
            <Button variant="outline" size="small">
              Ver Pendientes
            </Button>
          </div>
          <div className="quick-action-card">
            <h4>📊 Análisis de Gastos</h4>
            <p>Analizar tendencias y patrones de gastos</p>
            <Button variant="outline" size="small">
              Ver Análisis
            </Button>
          </div>
          <div className="quick-action-card">
            <h4>💰 Presupuesto</h4>
            <p>Gestionar presupuestos por categoría</p>
            <Button variant="outline" size="small">
              Gestionar
            </Button>
          </div>
          <div className="quick-action-card">
            <h4>📤 Exportar Datos</h4>
            <p>Exportar gastos en formato Excel o PDF</p>
            <Button variant="outline" size="small">
              Exportar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GastosPage;