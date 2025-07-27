import React, { useState, useEffect } from 'react';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Simular datos de actividad reciente
    const mockActivities = [
      {
        id: 1,
        type: 'payroll',
        message: 'Nómina creada para Enero 2024',
        user: 'Admin',
        timestamp: '2024-01-15 10:30',
        icon: '💰'
      },
      {
        id: 2,
        type: 'invoice',
        message: 'Factura #001 enviada a Cliente ABC',
        user: 'María González',
        timestamp: '2024-01-15 09:15',
        icon: '📄'
      },
      {
        id: 3,
        type: 'employee',
        message: 'Nuevo empleado agregado: Juan Pérez',
        user: 'Admin',
        timestamp: '2024-01-14 16:45',
        icon: '👤'
      },
      {
        id: 4,
        type: 'payment',
        message: 'Pago procesado para Factura #002',
        user: 'Sistema',
        timestamp: '2024-01-14 14:20',
        icon: '✅'
      },
      {
        id: 5,
        type: 'report',
        message: 'Reporte mensual generado',
        user: 'Carlos López',
        timestamp: '2024-01-13 11:00',
        icon: '📊'
      }
    ];

    setActivities(mockActivities);
  }, []);

  const getActivityTypeClass = (type) => {
    const typeClasses = {
      payroll: 'activity-payroll',
      invoice: 'activity-invoice',
      employee: 'activity-employee',
      payment: 'activity-payment',
      report: 'activity-report'
    };
    return typeClasses[type] || 'activity-default';
  };

  return (
    <div className="recent-activity">
      <div className="recent-activity-header">
        <h2>Actividad Reciente</h2>
        <button className="view-all-btn">Ver todo</button>
      </div>
      
      <div className="activity-list">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className={`activity-item ${getActivityTypeClass(activity.type)}`}
          >
            <div className="activity-icon">{activity.icon}</div>
            <div className="activity-content">
              <p className="activity-message">{activity.message}</p>
              <div className="activity-meta">
                <span className="activity-user">{activity.user}</span>
                <span className="activity-time">{activity.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;