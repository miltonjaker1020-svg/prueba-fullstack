import { useState, type ReactNode } from 'react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { productsService } from '../services/products.service';
import { categoriesService } from '../services/categories.service';
import { useFetch } from '../hooks/useFetch';
import { useFetch as useCategoriesFetch } from '../hooks/useFetch';
import { ProductCard } from '../components/ui/ProductCard';
import { Pagination } from '../components/ui/Pagination';
import { ProductFilters } from '../components/ui/ProductFilters';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Alert } from '../components/ui/Alert';

export function ProductsPage(): ReactNode {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? '1');
  const rawSearch = searchParams.get('search') ?? '';
  const categoryId = searchParams.get('categoryId') ?? '';

  const [inputSearch, setInputSearch] = useState<string>(rawSearch);
  const debouncedSearch = useDebounce(inputSearch, 400);

  const { data: categories } = useCategoriesFetch(() => categoriesService.getAll(), []);

  useEffect(() => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set('search', debouncedSearch);
        next.set('page', '1');
        return next;
      },
      { replace: true },
    );
  }, [debouncedSearch, setSearchParams]);

  const { data, loading, error, refetch } = useFetch(
    () => productsService.getAll({ search: debouncedSearch, ...(categoryId ? { categoryId } : {}), page, limit: 9 }),
    [debouncedSearch, categoryId, page],
  );

  function handlePageChange(nextPage: number): void {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set('page', String(nextPage));
        return next;
      },
      { replace: true },
    );
  }

  function handleCategoryChange(nextCategoryId: string): void {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (nextCategoryId) {
          next.set('categoryId', nextCategoryId);
        } else {
          next.delete('categoryId');
        }
        next.set('page', '1');
        return next;
      },
      { replace: true },
    );
  }

  return (
    <section className="page">
      <header className="page-header">
        <h1>Productos</h1>
      </header>

      <ProductFilters
        search={inputSearch}
        categoryId={categoryId}
        categories={categories ?? []}
        onSearchChange={setInputSearch}
        onCategoryChange={handleCategoryChange}
      />

      {loading && <Spinner label="Cargando productos…" />}
      {error !== null && (
        <>
          <Alert tone="error" message={error} />
          <button type="button" className="btn-secondary" onClick={refetch}>Reintentar</button>
        </>
      )}
      {!loading && error === null && data !== null && data.data.length === 0 && (
        <EmptyState title="No se encontraron productos" hint="Prueba ajustar tu búsqueda o quitar filtros." />
      )}
      {!loading && error === null && data !== null && data.data.length > 0 && (
        <>
          <p className="results-info">
            {data.total} resultado{data.total === 1 ? '' : 's'} — página {data.page} de{' '}
            {data.totalPages}
          </p>
          <div className="product-grid">
            {data.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
}
