import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('quickshare-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function imageUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const apiRoot = import.meta.env.VITE_API_URL || '/api';
  return `${apiRoot.replace(/\/api\/?$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

export function errorMessage(error) {
  if (error.code === 'ECONNABORTED') return 'The QuickShare API took too long to respond. Check that the backend and MongoDB Atlas are running.';
  const message = error.response?.data?.message;
  if (message) return message;
  if (!error.response || typeof error.response.data !== 'object') {
    return 'Cannot reach the QuickShare API. Start the backend and check the MongoDB Atlas settings in server/.env.';
  }
  return 'Something went wrong. Please try again.';
}
