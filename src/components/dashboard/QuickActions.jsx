import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const QuickActions = () => {
  const actions = [
    {
      title: 'Crear Nómina',
      description: 'Generar nueva nómina para empleados',
      link: '/nominas/crear',
      icon: '💰',
      color: 'green'
    },
    {
      title: 'Nueva Factura',
      description: 'Crear factura para cliente',
      link: '/facturacion/crear',
      icon: '📄',
      color: 'blue'
    },
    {
      title: 'Agregar Empleado',
      description: 'Registrar nuevo empleado',
      link: '/empleados/crear',
      icon: '👤',
      color: 'purple'
    },
    {
      title: 'Ver Reportes',
      description: 'Consultar reportes del sistema',
      link: '/nominas/reportes',
      icon: '📊',
      color: 'orange'
    }
  ];

  return (
    <div className="quick-actions">
      <div className="quick-actions-header">
        <h2>Acciones Rápidas</h2>
      </div>
      <div className="quick-actions-grid">
        {actions.map((action, index) => (
          <Link 
            key={index} 
            to={action.link} 
            className={`quick-action-card quick-action-${action.color}`}
          >
            <div className="quick-action-icon">{action.icon}</div>
            <div className="quick-action-content">
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;