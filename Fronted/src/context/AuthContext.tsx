import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { tokenStorage } from '../api/token-storage';
import { UNAUTHORIZED_EVENT } from '../api/client';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '../types/api.types';

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  initializing: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): ReactNode {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  const clearSession = useCallback((): void => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  const applySession = useCallback((auth: AuthResponse): void => {
    tokenStorage.set(auth.accessToken);
    setUser(auth.user);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap(): Promise<void> {
      const token = tokenStorage.get();
      if (!token) {
        setInitializing(false);
        return;
      }
      try {
        const me = await authService.me();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }

    void bootstrap();

    const handleUnauthorized = (): void => clearSession();
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      cancelled = true;
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [clearSession]);

  const login = useCallback(
    async (payload: LoginPayload): Promise<void> => {
      const auth = await authService.login(payload);
      applySession(auth);
    },
    [applySession],
  );

  const register = useCallback(
    async (payload: RegisterPayload): Promise<void> => {
      const auth = await authService.register(payload);
      applySession(auth);
    },
    [applySession],
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } catch {
      clearSession();
      return;
    }
    clearSession();
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isAdmin: user?.role === 'admin',
      initializing,
      login,
      register,
      logout,
    }),
    [user, initializing, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

