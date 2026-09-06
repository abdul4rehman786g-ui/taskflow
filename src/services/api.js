// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Bearer token fallback for iframe / cross-site environments
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('taskflow_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore localStorage access errors if storage is partitioned
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    // Pass structured error object
    return Promise.reject({
      status: error.response?.status,
      message,
      data: error.response?.data,
    });
  }
);

export default api;
