import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:5000/api',
  baseURL: 'https://sadik-traders-backend.vercel.app/api',
});
  
api.interceptors.request.use((config) => {
  if (config.method !== 'get' && !(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

export default api;
