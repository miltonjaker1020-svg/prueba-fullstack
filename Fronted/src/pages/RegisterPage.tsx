import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../api/ApiError';
import { Alert } from '../components/ui/Alert';

interface RegisterValues {
  name: string;
  email: string;
  password: string;
}

interface FieldErrors {
  name?: string[];
  email?: string[];
  password?: string[];
}

const EMPTY_VALUES: RegisterValues = { name: '', email: '', password: '' };

function isFieldErrors(value: unknown): value is FieldErrors {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return ['name', 'email', 'password'].some((key) => Array.isArray(record[key]));
}

export function RegisterPage(): ReactNode {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState<RegisterValues>(EMPTY_VALUES);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setSubmitting(true);
    try {
      await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      navigate('/productos');
    } catch (caught) {
      const apiError = ApiError.of(caught);
      if (isFieldErrors(caught)) {
        setFieldErrors(caught);
      } else {
        setFormError(apiError.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="card form" onSubmit={handleSubmit} noValidate>
        <h1>Crear cuenta</h1>

        <label htmlFor="name">Nombre completo</label>
        <input id="name" name="name" type="text" value={values.name} onChange={handleChange} required />
        {fieldErrors.name?.map((msg) => (
          <p key={msg} className="field-error">{msg}</p>
        ))}

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
        {fieldErrors.email?.map((msg) => (
          <p key={msg} className="field-error">{msg}</p>
        ))}

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          required
        />
        {fieldErrors.password?.map((msg) => (
          <p key={msg} className="field-error">{msg}</p>
        ))}

        {formError !== null && <Alert tone="error" message={formError} />}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>

        <p className="form-hint">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </section>
  );
}
