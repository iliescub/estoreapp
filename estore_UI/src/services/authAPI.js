import api from './api';

  export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (payload) => api.post('/auth/register', payload),
    me: () => api.get('/auth/me'),
  };