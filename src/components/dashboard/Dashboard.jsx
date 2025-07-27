import React, { useState, useEffect } from 'react';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import '../../styles/components/dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activePayrolls: 0,
    pendingInvoices: 0,
    monthlyRevenue: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setStats({
        totalEmployees: 45,
        activePayrolls: 12,
        pendingInvoices: 8,
        monthlyRevenue: 125000
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Resumen general del sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Empleados"
          value={stats.totalEmployees}
          icon="👥"
          color="blue"
          trend="+3"
        />
        <StatsCard
          title="Nóminas Activas"
          value={stats.activePayrolls}
          icon="💰"
          color="green"
          trend="+2"
        />
        <StatsCard
          title="Facturas Pendientes"
          value={stats.pendingInvoices}
          icon="📄"
          color="orange"
          trend="-1"
        />
        <StatsCard
          title="Ingresos del Mes"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon="📈"
          color="purple"
          trend="+12%"
        />
      </div>

      <div className="dashboard-content">
        <div className="dashboard-left">
          <RecentActivity />
        </div>
        <div className="dashboard-right">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;