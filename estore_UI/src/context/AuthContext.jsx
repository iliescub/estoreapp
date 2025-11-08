 import { createContext, useContext, useEffect, useMemo, useState } from 'react';
  import api from '../services/api';
  import { authAPI } from '../services/authAPI';

  const AuthContext = createContext(null);

  export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('authToken'));
    const [user, setUser] = useState(() => {
      const stored = localStorage.getItem('authUser');
      return stored ? JSON.parse(stored) : null;
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (token) {
        localStorage.setItem('authToken', token);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
      } else {
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common.Authorization;
      }
    }, [token]);

    useEffect(() => {
      if (user) localStorage.setItem('authUser', JSON.stringify(user));
      else localStorage.removeItem('authUser');
    }, [user]);

    const hydrateSession = (data) => {
    setToken(data.token);
    setUser({
       id: data.userId,
       firstName: data.firstName,
       lastName: data.lastName,
       email: data.email,
       role: data.role,
      });
    };
    const login = async (email, password) => {
      setLoading(true);
      try {
        const { data } = await authAPI.login(email, password);
        hydrateSession(data);
        return data;
      } finally {
        setLoading(false);
      }
    };
    const register = async (payload) => {
      setLoading(true);
      try {
        const { data } = await authAPI.register(payload);
        hydrateSession(data);
        return data;
      } finally {
        setLoading(false);
      }
    };

    const logout = () => {
      setToken(null);
      setUser(null);
    };

    const value = useMemo(
       () => ({ user, token, loading, login, register, logout, isAdmin: user?.role === 'Admin' }),
       [user, token, loading]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }

  export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
  };