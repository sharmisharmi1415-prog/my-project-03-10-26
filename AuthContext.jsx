import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const restoreSession = useCallback(async () => {
    const token = localStorage.getItem('quickshare-token');
    if (!token) {
      setAuthError('');
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setAuthError('');
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('quickshare-token');
        setUser(null);
      } else {
        setAuthError('QuickShare could not verify your session because the API is unavailable. Check the backend and MongoDB Atlas connection, then retry.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const value = useMemo(() => ({
    user,
    loading,
    authError,
    retryAuth: restoreSession,
    acceptSession: ({ token, user: nextUser }) => {
    localStorage.setItem('quickshare-token', token);
    setUser(nextUser);
    setAuthError('');
    },
    updateUser: setUser,
    logout: () => {
      localStorage.removeItem('quickshare-token');
      setUser(null);
      setAuthError('');
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
