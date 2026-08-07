import { createContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('fixnear_token'));
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);

  const api = useMemo(() => {
    const instance = axios.create();
    instance.interceptors.request.use((config) => {
      const currentToken = localStorage.getItem('fixnear_token');
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
      return config;
    });
    return instance;
  }, []);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/api/auth/me');
        setUser(response.data.data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem('fixnear_token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token, api]);

  const login = async ({ user: loggedUser, token: accessToken }) => {
    localStorage.setItem('fixnear_token', accessToken);
    setToken(accessToken);
    setUser(loggedUser);
  };

  const logout = () => {
    localStorage.removeItem('fixnear_token');
    setToken(null);
    setUser(null);
  };

  const value = { user, token, login, logout, loading, error, api };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
