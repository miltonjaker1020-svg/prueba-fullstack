import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { ProductCard } from '../components/ui/ProductCard';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Alert } from '../components/ui/Alert';

export function FavoritesPage(): ReactNode {
  const { favorites, loading, error, refresh } = useFavorites();

  return (
    <section className="page">
      <header className="page-header">
        <h1>Mis favoritos</h1>
        <p className="page-subtitle">Los productos que guardaste para ver después.</p>
      </header>

      {loading && <Spinner label="Cargando favoritos…" />}

      {error !== null && (
        <>
          <Alert tone="error" message={error} />
          <button type="button" className="btn-secondary" onClick={refresh}>Reintentar</button>
        </>
      )}

      {!loading && error === null && favorites.length === 0 && (
        <EmptyState
          title="Aún no tienes favoritos"
          hint="Busca productos y toca la estrella ☆ para guardarlos aquí."
        />
      )}

      {!loading && error === null && favorites.length > 0 && (
        <div className="product-grid">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!loading && error === null && favorites.length > 0 && (
        <p className="results-info">{favorites.length} producto{favorites.length === 1 ? '' : 's'} guardado{favorites.length === 1 ? '' : 's'}</p>
      )}

      <Link to="/productos" className="btn-secondary" style={{ marginTop: '1rem', display: 'inline-block' }}>
        Volver a productos
      </Link>
    </section>
  );
}
