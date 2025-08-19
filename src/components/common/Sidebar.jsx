import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import '../../styles/components/sidebar.css';

const menuItems = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: '📊'
  },
  {
    path: '/nominas',
    name: 'Nóminas',
    icon: '💰',
    submenu: [
      { path: '/nominas', name: 'Ver Nóminas' },
      { path: '/nominas/crear', name: 'Crear Nómina' },
      { path: '/nominas/grupos', name: 'Grupos' },
      { path: '/nominas/reportes', name: 'Reportes' }
    ]
  },
  {
    path: '/facturacion',
    name: 'Facturación',
    icon: '📄',
    submenu: [
      { path: '/facturacion', name: 'Ver Facturas' },
      { path: '/facturacion/crear', name: 'Crear Factura' },
      { path: '/clientes', name: 'Clientes' },
    ]
  },
  {
    path: '/empleados',
    name: 'Empleados',
    icon: '👥',
    submenu: [
      { path: '/empleados', name: 'Ver Empleados' },
      { path: '/empleados/crear', name: 'Agregar Empleado' }
    ]
  },
  {
    path: '/configuracion',
    name: 'Configuración',
    icon: '⚙️',
    submenu: [
      { path: '/configuracion', name: 'General' },
      { path: '/configuracion/empresa', name: 'Empresa' },
      { path: '/configuracion/usuario', name: 'Usuario' },
      { path: '/configuracion/sistema', name: 'Sistema' }
    ]
  }
];

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const { sidebarCollapsed, toggleSidebar } = useAppContext();
  const [expandedItems, setExpandedItems] = React.useState({});

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleSubmenu = (path) => {
    setExpandedItems(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <h2>{sidebarCollapsed ? 'SFN' : 'Sistema F&N'}</h2>
        </div>
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <div className={`nav-link ${isActive(item.path) ? 'active' : ''}`}>
                <Link to={item.path} className="nav-link-content">
                  <span className="nav-icon">{item.icon}</span>
                  {!sidebarCollapsed && <span className="nav-text">{item.name}</span>}
                </Link>
                
                {item.submenu && !sidebarCollapsed && (
                  <button 
                    className="submenu-toggle"
                    onClick={() => toggleSubmenu(item.path)}
                  >
                    {expandedItems[item.path] ? '▼' : '▶'}
                  </button>
                )}
              </div>

              {item.submenu && !sidebarCollapsed && expandedItems[item.path] && (
                <ul className="submenu">
                  {item.submenu.map((subitem) => (
                    <li key={subitem.path}>
                      <Link 
                        to={subitem.path}
                        className={`submenu-link ${isActive(subitem.path) ? 'active' : ''}`}
                      >
                        {subitem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          {!sidebarCollapsed && (
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          )}
          <button 
            className="logout-btn"
            onClick={handleLogout}
            title="Cerrar Sesión"
          >
            🚪
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;