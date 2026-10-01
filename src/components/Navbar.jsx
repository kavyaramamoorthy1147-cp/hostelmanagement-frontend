import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ title = 'Hostel Management System' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="top-navbar">
      <div className="navbar-title-section">
        <h2>{title}</h2>
      </div>

      <div className="navbar-user-section">
        <div className="user-badge">
          <div className="user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {user?.name || 'User'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {user?.email}
            </span>
          </div>
          <span className={`user-role-tag role-${user?.role || 'student'}`}>
            {user?.role}
          </span>
        </div>

        <button
          onClick={handleLogout}
          title="Logout"
          className="btn-secondary btn-sm"
          style={{ padding: '7px 10px', borderRadius: '8px', cursor: 'pointer' }}
        >
          <LogOut size={16} color="#dc2626" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
