import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hostelmanagement-backend-bi2r.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hostel_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hostel_token');
      localStorage.removeItem('hostel_user');
    }

    return Promise.reject(error);
  }
);

export default api;
