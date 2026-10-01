import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ fontWeight: 600, color: '#64748b' }}>Loading user session...</p>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Redirect to respective dashboard if unauthorized for this role
    return user.role === 'admin' 
      ? <Navigate to="/admin-dashboard" replace /> 
      : <Navigate to="/student-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
