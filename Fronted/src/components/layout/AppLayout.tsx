import type { ReactNode } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CrashTrigger } from '../CrashTrigger';

export function AppLayout(): ReactNode {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const crashEnabled = import.meta.env.DEV
    ? new URLSearchParams(window.location.search).has('crash')
    : false;

  async function handleLogout(): Promise<void> {
    await logout();
    navigate('/productos');
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <Link to="/productos" className="navbar-brand">
          Gestión de Productos
        </Link>
        <nav className="navbar-links">
          <NavLink to="/productos">Productos</NavLink>
          <NavLink to="/categorias">Categorías</NavLink>
          {isAuthenticated && <NavLink to="/favoritos">Mis favoritos</NavLink>}
          {isAdmin && <NavLink to="/categorias/nueva">Nueva categoría</NavLink>}
        </nav>
        <div className="navbar-session">
          {isAuthenticated && user !== null ? (
            <>
              <span className="navbar-user">
                {user.name}
                <small>{user.role}</small>
              </span>
              <button type="button" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Iniciar sesión</NavLink>
              <NavLink to="/registro" className="navbar-cta">
                Registrarse
              </NavLink>
            </>
          )}
        </div>
      </header>
      <CrashTrigger enabled={crashEnabled} />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        Simulacro — Frontend React + TypeScript consumiendo API NestJS.
      </footer>
    </div>
  );
}
