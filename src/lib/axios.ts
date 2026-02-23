import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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
