import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../api/ApiError';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';

interface LoginValues {
  email: string;
  password: string;
}

const EMPTY_VALUES: LoginValues = { email: '', password: '' };

export function LoginPage(): ReactNode {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState<LoginValues>(EMPTY_VALUES);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email: values.email.trim(), password: values.password });
      const from = location.state?.from;
      navigate(typeof from === 'string' ? from : '/productos');
    } catch (caught) {
      setError(ApiError.of(caught).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="card form" onSubmit={handleSubmit} noValidate>
        <h1>Iniciar sesión</h1>

        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          required
        />

        {error !== null && <Alert tone="error" message={error} />}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Ingresando…' : 'Entrar'}
        </button>

        <p className="form-hint">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </form>
      {submitting && <Spinner label="Validando credenciales…" />}
    </section>
  );
}
