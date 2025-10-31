// src/services/api/config.js
import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'https://your-api-base-url.com/api'; // Replace with your API base URL

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // You can add authentication token here
    const token = localStorage.getItem('authToken'); // or from Redux store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      console.log('Unauthorized, redirecting to login...');
      // You can dispatch logout action here
    } else if (error.response?.status === 500) {
      console.log('Server error occurred');
    }
    return Promise.reject(error);
  }
);

export default apiClient;