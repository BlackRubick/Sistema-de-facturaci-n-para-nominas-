import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { useAppContext } from '../../context/AppContext';

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('activos');
  const [searchTerm, setSearchTerm] = useState('');
  const { addNotification } = useAppContext();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockEmployees = [
        {
          id: 1,
          name: 'Juan Pérez',
          email: 'juan.perez@empresa.com',
          phone: '+58 414-1234567',
          position: 'Desarrollador Senior',
          department: 'Tecnología',
          baseSalary: 50000,
          hireDate: '2022-01-15',
          status: 'activo',
          address: 'Av. Principal, Centro, Caracas',
          identification: 'V-12345678',
          birthDate: '1990-05-15'
        },
        {
          id: 2,
          name: 'María González',
          email: 'maria.gonzalez@empresa.com',
          phone: '+58 424-2345678',
          position: 'Diseñadora UX/UI',
          department: 'Diseño',
          baseSalary: 45000,
          hireDate: '2022-03-10',
          status: 'activo',
          address: 'Calle 5, Los Palos Grandes, Caracas',
          identification: 'V-23456789',
          birthDate: '1992-08-22'
        },
        {
          id: 3,
          name: 'Carlos López',
          email: 'carlos.lopez@empresa.com',
          phone: '+58 412-3456789',
          position: 'Gerente de Ventas',
          department: 'Ventas',
          baseSalary: 80000,
          hireDate: '2021-06-01',
          status: 'activo',
          address: 'Urb. Las Mercedes, Caracas',
          identification: 'V-34567890',
          birthDate: '1985-12-03'
        },
        {
          id: 4,
          name: 'Ana Martínez',
          email: 'ana.martinez@empresa.com',
          phone: '+58 426-4567890',
          position: 'Contadora',
          department: 'Finanzas',
          baseSalary: 55000,
          hireDate: '2021-09-15',
          status: 'activo',
          address: 'Av. Libertador, Chacao, Caracas',
          identification: 'V-45678901',
          birthDate: '1988-03-18'
        },
        {
          id: 5,
          name: 'Luis Rodríguez',
          email: 'luis.rodriguez@empresa.com',
          phone: '+58 414-5678901',
          position: 'Analista de Sistemas',
          department: 'Tecnología',
          baseSalary: 42000,
          hireDate: '2023-02-01',
          status: 'inactivo',
          address: 'Calle 10, Altamira, Caracas',
          identification: 'V-56789012',
          birthDate: '1993-07-25'
        }
      ];
      
      setEmployees(mockEmployees);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al cargar empleados'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesFilter = filter === 'todos' || employee.status === filter;
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'activo': { class: 'status-active', text: 'Activo' },
      'inactivo': { class: 'status-inactive', text: 'Inactivo' },
      'suspendido': { class: 'status-suspended', text: 'Suspendido' },
      'vacaciones': { class: 'status-vacation', text: 'Vacaciones' }
    };

    const config = statusConfig[status] || statusConfig['activo'];
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

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este empleado? Esta acción no se puede deshacer.')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setEmployees(employees.filter(e => e.id !== id));
        addNotification({
          type: 'success',
          message: 'Empleado eliminado exitosamente'
        });
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Error al eliminar empleado'
        });
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setEmployees(employees.map(emp => 
        emp.id === id 
          ? { ...emp, status: emp.status === 'activo' ? 'inactivo' : 'activo' }
          : emp
      ));
      
      addNotification({
        type: 'success',
        message: 'Estado del empleado actualizado'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al actualizar estado'
      });
    }
  };

  const exportEmployees = () => {
    addNotification({
      type: 'info',
      message: 'Función de exportación en desarrollo'
    });
  };

  if (loading) {
    return <Loading text="Cargando empleados..." />;
  }

  return (
    <div className="employee-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Gestión de Empleados</h1>
          <p>Administra la información de todos los empleados</p>
        </div>
        <div className="page-actions">
          <Button variant="outline" onClick={exportEmployees}>
            📊 Exportar
          </Button>
          <Link to="/empleados/crear">
            <Button variant="primary">
              ➕ Nuevo Empleado
            </Button>
          </Link>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Buscar por nombre, email, cargo o departamento..."
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
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
            <option value="suspendido">Suspendidos</option>
            <option value="vacaciones">En Vacaciones</option>
          </select>
        </div>
      </div>

      <div className="employee-stats">
        <div className="stat-card">
          <h3>Total Empleados</h3>
          <p className="stat-value">{employees.length}</p>
        </div>
        <div className="stat-card">
          <h3>Activos</h3>
          <p className="stat-value">{employees.filter(e => e.status === 'activo').length}</p>
        </div>
        <div className="stat-card">
          <h3>Departamentos</h3>
          <p className="stat-value">{new Set(employees.map(e => e.department)).size}</p>
        </div>
        <div className="stat-card">
          <h3>Nómina Total</h3>
          <p className="stat-value">
            {formatCurrency(employees.filter(e => e.status === 'activo').reduce((sum, e) => sum + e.baseSalary, 0))}
          </p>
        </div>
      </div>

      <div className="employee-table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Cargo</th>
              <th>Departamento</th>
              <th>Salario Base</th>
              <th>Fecha Ingreso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <div className="employee-cell">
                      <div className="employee-avatar">
                        {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="employee-info">
                        <strong>{employee.name}</strong>
                        <small>{employee.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>{employee.position}</td>
                  <td>
                    <span className="department-badge">{employee.department}</span>
                  </td>
                  <td className="currency">{formatCurrency(employee.baseSalary)}</td>
                  <td>{formatDate(employee.hireDate)}</td>
                  <td>{getStatusBadge(employee.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/empleados/editar/${employee.id}`}>
                        <Button size="small" variant="outline" title="Editar">
                          ✏️
                        </Button>
                      </Link>
                      <Button 
                        size="small" 
                        variant={employee.status === 'activo' ? 'warning' : 'success'}
                        onClick={() => handleToggleStatus(employee.id)}
                        title={employee.status === 'activo' ? 'Desactivar' : 'Activar'}
                      >
                        {employee.status === 'activo' ? '⏸️' : '▶️'}
                      </Button>
                      <Button 
                        size="small" 
                        variant="error"
                        onClick={() => handleDeleteEmployee(employee.id)}
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
                <td colSpan="7" className="no-data">
                  {searchTerm || filter !== 'todos' ? 
                    'No se encontraron empleados con los filtros aplicados' : 
                    'No hay empleados registrados'
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="department-summary">
        <h3>Resumen por Departamento</h3>
        <div className="department-grid">
          {[...new Set(employees.map(e => e.department))].map(dept => {
            const deptEmployees = employees.filter(e => e.department === dept && e.status === 'activo');
            const deptSalary = deptEmployees.reduce((sum, e) => sum + e.baseSalary, 0);
            
            return (
              <div key={dept} className="department-card">
                <h4>{dept}</h4>
                <div className="dept-stats">
                  <span>{deptEmployees.length} empleados</span>
                  <span className="dept-salary">{formatCurrency(deptSalary)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;