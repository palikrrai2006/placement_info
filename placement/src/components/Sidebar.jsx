import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    {
      path: '/student/dashboard',
      icon: '📊',
      label: 'Dashboard',
    },
    {
      path: '/student/profile',
      icon: '👤',
      label: 'Profile',
    },
    {
      path: '/student/jobs',
      icon: '💼',
      label: 'Job Openings',
    },
    {
      path: '/student/applications',
      icon: '📋',
      label: 'Applications',
    },
    {
      path: '/student/companies',
      icon: '🏢',
      label: 'Companies',
    },
    {
      path: '/student/analytics',
      icon: '📈',
      label: 'Analytics',
    },
    {
      path: '/student/notifications',
      icon: '🔔',
      label: 'Notifications',
      badge: 3,
    },
    {
      path: '/student/settings',
      icon: '⚙️',
      label: 'Settings',
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🎓</span>
          {!isCollapsed && <span className="logo-text">PlaceHub</span>}
        </div>
        <button 
          className="toggle-btn" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            title={isCollapsed ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!isCollapsed && (
              <>
                <span className="nav-label">{item.label}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </>
            )}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        {user && !isCollapsed && (
          <div className="user-info">
            <div className="user-avatar">{user.fullName?.charAt(0) || user.email?.charAt(0) || '?'}</div>
            <div className="user-details">
              <div className="user-name">{user.fullName || user.email}</div>
              <div className="user-email">{user.email}</div>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="nav-item logout" style={{width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left'}}>
          <span className="nav-icon">🚪</span>
          {!isCollapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
