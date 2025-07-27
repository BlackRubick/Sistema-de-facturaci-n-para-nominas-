import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/payroll">Nóminas</Link></li>
          <li><Link to="/billing">Facturación</Link></li>
          <li><Link to="/employees">Empleados</Link></li>
          <li><Link to="/settings">Configuración</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
