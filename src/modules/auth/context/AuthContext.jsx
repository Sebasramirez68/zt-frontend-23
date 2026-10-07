import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService.js';
import { tokenStorage } from '../services/tokenStorage.js';
import { isExpired } from '../utils/jwt.js';
import { configureHttpClient } from '../../../shared/api/httpClient.js';

const AuthContext = createContext(null);

function initialSession() {
  const saved = tokenStorage.load();
  if (saved?.token && !isExpired(saved.token)) return saved;
  tokenStorage.clear();
  return null;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(initialSession);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setSession(null);
  }, []);

  const login = useCallback(async (username, password) => {
    const result = await authService.login(username, password);
    const next = { token: result.token, expiresAt: result.expiresAt, user: result.user };
    tokenStorage.save(next);
    setSession(next);
  }, []);

  // El interceptor siempre lee el token actual y cierra sesión ante un 401.
  configureHttpClient({ getToken: () => session?.token ?? null, onUnauthorized: logout });

  // Cierre automático cuando el JWT expira.
  useEffect(() => {
    if (!session) return undefined;
    const ms = session.expiresAt * 1000 - Date.now();
    const timer = setTimeout(logout, Math.max(ms, 0));
    return () => clearTimeout(timer);
  }, [session, logout]);

  const value = useMemo(
    () => ({ session, isAuthenticated: Boolean(session), login, logout }),
    [session, login, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
