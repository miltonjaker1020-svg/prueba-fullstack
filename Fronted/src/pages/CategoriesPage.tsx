import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { categoriesService } from '../services/categories.service';
import { useFetch } from '../hooks/useFetch';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Alert } from '../components/ui/Alert';

export function CategoriesPage(): ReactNode {
  const { data: categories, loading, error, refetch } = useFetch(
    () => categoriesService.getAll(),
    [],
  );

  return (
    <section className="page">
      <header className="page-header">
        <h1>Categorías</h1>
        <p className="page-subtitle">Explora el catálogo por categoría.</p>
      </header>

      {loading && <Spinner label="Cargando categorías…" />}
      {error !== null && (
        <>
          <Alert tone="error" message={error} />
          <button type="button" className="btn-secondary" onClick={refetch}>
            Reintentar
          </button>
        </>
      )}
      {!loading && error === null && categories !== null && categories.length === 0 && (
        <EmptyState
          title="Todavía no hay categorías"
          hint="Un administrador puede crear la primera desde el menú."
        />
      )}

      {!loading && categories !== null && categories.length > 0 && (
        <ul className="category-grid">
          {categories.map((category) => (
            <li key={category.id}>
              <Link to={`/categorias/${category.id}`} className="card category-card">
                <h2>{category.name}</h2>
                {category.description && <p>{category.description}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
