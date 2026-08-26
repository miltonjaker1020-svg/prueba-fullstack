import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function RequireRole(): ReactNode {
  const { isAdmin, initializing, isAuthenticated } = useAuth();

  if (initializing) {
    return <div className="page-loading">Cargando…</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/productos" replace />;
  }

  return <Outlet />;
}
