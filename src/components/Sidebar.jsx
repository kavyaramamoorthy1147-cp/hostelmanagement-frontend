import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  BedDouble,
  AlertCircle,
  User,
  LogOut,
  Building2
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <Building2 size={22} />
        </div>
        <div>
          <div className="sidebar-logo-title">HostelCare</div>
          <div className="sidebar-logo-sub">
            {isAdmin ? 'Admin Portal' : 'Student Portal'}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {isAdmin ? (
          <>
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/students"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Users size={18} />
              <span>Students</span>
            </NavLink>

            <NavLink
              to="/rooms"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <BedDouble size={18} />
              <span>Rooms</span>
            </NavLink>

            <NavLink
              to="/complaints"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <AlertCircle size={18} />
              <span>Complaints</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/student-dashboard"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <User size={18} />
              <span>My Profile</span>
            </NavLink>

            <NavLink
              to="/rooms"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <BedDouble size={18} />
              <span>Hostel Rooms</span>
            </NavLink>

            <NavLink
              to="/complaints"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <AlertCircle size={18} />
              <span>My Complaints</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Sidebar Footer with Logout */}
      <div className="sidebar-footer">
        <button
          onClick={handleLogout}
          className="sidebar-link"
          style={{
            background: 'transparent',
            border: 'none',
            width: '100%',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <LogOut size={18} style={{ color: '#ef4444' }} />
          <span style={{ color: '#fca5a5' }}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
