import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Home } from 'lucide-react';

const NotFound = () => {
  const { user } = useAuth();
  const dashboardLink = user?.role === 'admin' ? '/admin-dashboard' : '/student-dashboard';

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ textAlign: 'center', maxWidth: '440px' }}>
        <div className="auth-logo-badge" style={{ background: '#ef4444' }}>
          <Building2 size={28} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>404</h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '8px 0', color: 'var(--text-muted)' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to={user ? dashboardLink : '/login'} className="btn btn-primary" style={{ width: '100%' }}>
          <Home size={18} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
