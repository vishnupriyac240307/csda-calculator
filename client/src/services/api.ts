import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_URL;
const baseURL = rawBaseUrl
  ? (rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl.replace(/\/$/, '')}/api`)
  : '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach token from localStorage fallback if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('csda_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch proxy/network HTML/text errors and return meaningful messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 500 || error.response.status === 502 || error.response.status === 503)
    ) {
      const data = error.response.data;
      if (!data || typeof data !== 'object' || !data.message) {
        error.response.data = {
          success: false,
          message:
            'Cannot connect to the CSDA backend server on port 5001. Please make sure both servers are running by executing "npm run dev" from the csda-calculator folder.'
        };
      }
    }
    return Promise.reject(error);
  }
);

export default api;
