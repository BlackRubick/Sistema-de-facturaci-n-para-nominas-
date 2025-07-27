import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { useAppContext } from '../../context/AppContext';

const PayrollPage = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const { addNotification } = useAppContext();

  useEffect(() => {
    loadPayrolls();
  }, []);

  const loadPayrolls = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPayrolls = [
        {
          id: 1,
          period: 'Enero 2024',
          employee: 'Juan Pérez',
          position: 'Desarrollador',
          grossSalary: 50000,
          deductions: 7500,
          netSalary: 42500,
          status: 'pagada',
          payDate: '2024-01-31',
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          period: 'Enero 2024',
          employee: 'María González',
          position: 'Diseñadora',
          grossSalary: 45000,
          deductions: 6750,
          netSalary: 38250,
          status: 'pendiente',
          payDate: '2024-01-31',
          createdAt: '2024-01-15'
        },
        {
          id: 3,
          period: 'Enero 2024',
          employee: 'Carlos López',
          position: 'Gerente',
          grossSalary: 80000,
          deductions: 12000,
          netSalary: 68000,
          status: 'aprobada',
          payDate: '2024-01-31',
          createdAt: '2024-01-15'
        },
        {
          id: 4,
          period: 'Diciembre 2023',
          employee: 'Ana Martínez',
          position: 'Contadora',
          grossSalary: 55000,
          deductions: 8250,
          netSalary: 46750,
          status: 'pagada',
          payDate: '2023-12-31',
          createdAt: '2023-12-15'
        }
      ];
      
      setPayrolls(mockPayrolls);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al cargar nóminas'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPayrolls = payrolls.filter(payroll => {
    const matchesFilter = filter === 'todos' || payroll.status === filter;
    const matchesSearch = payroll.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payroll.period.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'borrador': { class: 'status-draft', text: 'Borrador' },
      'pendiente': { class: 'status-pending', text: 'Pendiente' },
      'aprobada': { class: 'status-approved', text: 'Aprobada' },
      'pagada': { class: 'status-paid', text: 'Pagada' },
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

  const handleDeletePayroll = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta nómina?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setPayrolls(payrolls.filter(p => p.id !== id));
        addNotification({
          type: 'success',
          message: 'Nómina eliminada exitosamente'
        });
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Error al eliminar nómina'
        });
      }
    }
  };

  const handleClonePayroll = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      addNotification({
        type: 'success',
        message: 'Nómina clonada exitosamente'
      });
      loadPayrolls();
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al clonar nómina'
      });
    }
  };

  if (loading) {
    return <Loading text="Cargando nóminas..." />;
  }

  return (
    <div className="payroll-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Gestión de Nóminas</h1>
          <p>Administra las nóminas de tus empleados</p>
        </div>
        <div className="page-actions">
          <Link to="/nominas/grupos">
            <Button variant="outline">
              👥 Gestionar Grupos
            </Button>
          </Link>
          <Link to="/nominas/crear">
            <Button variant="primary">
              ➕ Nueva Nómina
            </Button>
          </Link>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Buscar por empleado o período..."
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
            <option value="todos">Todos los estados</option>
            <option value="borrador">Borrador</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobada">Aprobada</option>
            <option value="pagada">Pagada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      <div className="payroll-stats">
        <div className="stat-card">
          <h3>Total Nóminas</h3>
          <p className="stat-value">{payrolls.length}</p>
        </div>
        <div className="stat-card">
          <h3>Pendientes</h3>
          <p className="stat-value">{payrolls.filter(p => p.status === 'pendiente').length}</p>
        </div>
        <div className="stat-card">
          <h3>Pagadas este mes</h3>
          <p className="stat-value">{payrolls.filter(p => p.status === 'pagada' && p.period.includes('2024')).length}</p>
        </div>
        <div className="stat-card">
          <h3>Total pagado</h3>
          <p className="stat-value">
            {formatCurrency(payrolls.reduce((sum, p) => p.status === 'pagada' ? sum + p.netSalary : sum, 0))}
          </p>
        </div>
      </div>

      <div className="payroll-table-container">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Período</th>
              <th>Cargo</th>
              <th>Salario Bruto</th>
              <th>Deducciones</th>
              <th>Salario Neto</th>
              <th>Estado</th>
              <th>Fecha de Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayrolls.length > 0 ? (
              filteredPayrolls.map((payroll) => (
                <tr key={payroll.id}>
                  <td>
                    <div className="employee-cell">
                      <strong>{payroll.employee}</strong>
                    </div>
                  </td>
                  <td>{payroll.period}</td>
                  <td>{payroll.position}</td>
                  <td className="currency">{formatCurrency(payroll.grossSalary)}</td>
                  <td className="currency text-error">{formatCurrency(payroll.deductions)}</td>
                  <td className="currency font-bold">{formatCurrency(payroll.netSalary)}</td>
                  <td>{getStatusBadge(payroll.status)}</td>
                  <td>{new Date(payroll.payDate).toLocaleDateString('es-ES')}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/nominas/editar/${payroll.id}`}>
                        <Button size="small" variant="outline" title="Editar">
                          ✏️
                        </Button>
                      </Link>
                      <Button 
                        size="small" 
                        variant="outline"
                        onClick={() => handleClonePayroll(payroll.id)}
                        title="Clonar"
                      >
                        📋
                      </Button>
                      <Button 
                        size="small" 
                        variant="error"
                        onClick={() => handleDeletePayroll(payroll.id)}
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
                  {searchTerm || filter !== 'todos' ? 
                    'No se encontraron nóminas con los filtros aplicados' : 
                    'No hay nóminas registradas'
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bulk-actions">
        <h3>Acciones en Lote</h3>
        <div className="bulk-action-buttons">
          <Button variant="outline">
            📋 Clonar Nóminas Seleccionadas
          </Button>
          <Button variant="primary">
            💰 Procesar Pagos en Lote
          </Button>
          <Button variant="outline">
            📊 Generar Reporte
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PayrollPage;