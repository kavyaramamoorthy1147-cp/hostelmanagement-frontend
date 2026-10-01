import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('hostel_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('hostel_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync / refresh current user on app start
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('hostel_user', JSON.stringify(res.data));
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const data = res.data;
    setUser(data);
    setToken(data.token);
    localStorage.setItem('hostel_token', data.token);
    localStorage.setItem('hostel_user', JSON.stringify(data));
    return data;
  };

  const register = async (studentData) => {
    const res = await api.post('/auth/register', studentData);
    const data = res.data;
    setUser(data);
    setToken(data.token);
    localStorage.setItem('hostel_token', data.token);
    localStorage.setItem('hostel_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hostel_token');
    localStorage.removeItem('hostel_user');
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      localStorage.setItem('hostel_user', JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      console.error('Error refreshing user details:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
