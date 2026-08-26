import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriesService } from '../services/categories.service';
import { ApiError } from '../api/ApiError';
import { Alert } from '../components/ui/Alert';

interface CategoryValues {
  name: string;
  description: string;
}

const EMPTY_VALUES: CategoryValues = { name: '', description: '' };

export function CategoryFormPage(): ReactNode {
  const navigate = useNavigate();
  const [values, setValues] = useState<CategoryValues>(EMPTY_VALUES);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await categoriesService.create({
        name: values.name.trim(),
        description: values.description.trim() || undefined,
      });
      navigate('/categorias');
    } catch (caught) {
      setError(ApiError.of(caught).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <h1>Nueva categoría</h1>
      </header>

      <form className="card form category-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="name">Nombre</label>
        <input
          id="name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          placeholder="Ej. Electrónica, Ropa, Hogar…"
          required
        />

        <label htmlFor="description">Descripción (opcional)</label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          placeholder="Describe brevemente qué contiene esta categoría…"
          rows={3}
        />

        {error !== null && <Alert tone="error" message={error} />}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Creando…' : 'Crear categoría'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/categorias')}>
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
