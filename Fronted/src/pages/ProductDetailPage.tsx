import type { ReactNode } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { productsService } from '../services/products.service';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../hooks/useAuth';
import { SafeImage } from '../components/ui/SafeImage';
import { PriceTag } from '../components/ui/PriceTag';
import { FavoriteButton } from '../components/ui/FavoriteButton';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';

export function ProductDetailPage(): ReactNode {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: product, loading, error, refetch } = useFetch(
    () => productsService.getById(id!),
    [id],
  );

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  async function handleDelete(): Promise<void> {
    if (id === undefined || product === null) return;
    const confirmed = window.confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    setDeleting(true);
    setDeleteError(null);
    try {
      await productsService.remove(id);
      navigate('/productos');
    } catch (caught) {
      setDeleteError(caught instanceof Error ? caught.message : 'No se pudo eliminar el producto.');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <Spinner label="Cargando producto…" />;
  if (error !== null)
    return (
      <section className="page">
        <Alert tone="error" message={error} />
        <button type="button" className="btn-secondary" onClick={refetch}>Reintentar</button>
      </section>
    );
  if (product === null) return <section className="page"><p>Producto no encontrado.</p></section>;

  return (
    <section className="page product-detail">
      <header className="page-header">
        <Link to="/productos" className="back-link">← Volver a productos</Link>
        <h1>{product.name}</h1>
        <div className="detail-meta">
          <PriceTag value={product.price} />
          <span className="stock-label">{product.stock > 0 ? `${product.stock} unidades` : 'Sin stock'}</span>
          {isAuthenticated && product !== null && <FavoriteButton product={product} />}
        </div>
      </header>

      <div className="detail-grid">
        {product.images.length > 0 && (
          <div className="detail-images">
            {product.images
              .sort((a, b) => a.order - b.order)
              .map((image) => (
                <div key={image.id} className="detail-image-wrap">
                  <SafeImage src={image.url} alt={`${product.name} — imagen ${image.order + 1}`} />
                </div>
              ))}
          </div>
        )}

        <div className="detail-info">
          <p className="detail-category">Categoría: <strong>{product.category.name}</strong></p>
          {product.description && <p className="detail-description">{product.description}</p>}

          {isAuthenticated && (
            <div className="detail-actions">
              <Link to={`/productos/${id}/editar`} className="btn-primary">Editar producto</Link>
              <button type="button" className="btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Eliminando…' : 'Eliminar producto'}
              </button>
            </div>
          )}
          {deleteError !== null && <Alert tone="error" message={deleteError} />}
        </div>
      </div>
    </section>
  );
}
