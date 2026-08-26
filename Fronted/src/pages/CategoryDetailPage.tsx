import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { categoriesService } from '../services/categories.service';
import { productsService } from '../services/products.service';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../hooks/useAuth';
import { ProductCard } from '../components/ui/ProductCard';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Alert } from '../components/ui/Alert';

export function CategoryDetailPage(): ReactNode {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  const { data: category, loading: loadingCategory, error: errorCategory, refetch: refetchCategory } =
    useFetch(() => categoriesService.getById(id!), [id]);

  const { data: products, loading: loadingProducts, error: errorProducts } = useFetch(
    () => productsService.getAll({ categoryId: id, limit: 100 }),
    [id],
  );

  const items = products?.data ?? [];

  return (
    <section className="page">
      <header className="page-header">
        <h1>{loadingCategory ? 'Cargando…' : category?.name ?? 'Categoría no encontrada'}</h1>
        {!loadingCategory && category?.description && <p className="page-subtitle">{category.description}</p>}

        {isAuthenticated && id !== undefined && (
          <Link to={`/categorias/${id}/nuevo-producto`} className="btn-primary">
            Agregar producto a esta categoría
          </Link>
        )}
      </header>

      {loadingCategory && <Spinner label="Cargando categoría…" />}

      {errorCategory !== null && (
        <>
          <Alert tone="error" message={errorCategory} />
          <button type="button" className="btn-secondary" onClick={refetchCategory}>Reintentar</button>
        </>
      )}

      {!loadingCategory && errorCategory === null && category !== null && (
        <>
          <h2 className="section-title">Productos en esta categoría</h2>
          {loadingProducts && <Spinner label="Cargando productos…" />}
          {errorProducts !== null && <Alert tone="error" message={errorProducts} />}
          {!loadingProducts && errorProducts === null && items.length === 0 && (
            <EmptyState title="No hay productos en esta categoría" hint="Sé el primero en agregar uno." />
          )}
          {!loadingProducts && errorProducts === null && items.length > 0 && (
            <div className="product-grid">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
