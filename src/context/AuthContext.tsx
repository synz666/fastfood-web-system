import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthSession } from '../types';
import { loginApi, registerApi, fetchMe } from '../api/authApi';
import { isAdminSession, readSession, toPublicSession, validateSession, writeSession } from '../utils/auth';

interface AuthContextValue {
  user: AuthSession | null;
  isReady: boolean;
  isAdmin: boolean;
  login: (identifier: string, password: string) => Promise<AuthSession>;
  register: (login: string, email: string, password: string) => Promise<AuthSession>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const storedSession = validateSession(readSession());
      if (!storedSession) {
        setIsReady(true);
        return;
      }

      try {
        const current = await fetchMe();
        if (!cancelled) {
          const session = toPublicSession(current);
          writeSession(session);
          setUser(session);
        }
      } catch {
        writeSession(null);
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const persistSession = useCallback((session: AuthSession | null) => {
    writeSession(session);
    setUser(session);
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const result = await loginApi({ identifier, password });
    const session = toPublicSession(result);
    persistSession(session);
    return session;
  }, [persistSession]);

  const register = useCallback(async (loginValue: string, email: string, password: string) => {
    const result = await registerApi({ login: loginValue, email, password });
    const session = toPublicSession(result);
    persistSession(session);
    return session;
  }, [persistSession]);

  const logout = useCallback(() => {
    writeSession(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isReady,
      isAdmin: isAdminSession(user),
      login,
      register,
      logout,
    }),
    [user, isReady, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
