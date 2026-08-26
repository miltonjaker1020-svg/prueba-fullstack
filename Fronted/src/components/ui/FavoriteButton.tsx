import { useState, type ReactNode } from 'react';
import { useFavorites } from '../../hooks/useFavorites';
import { useAuth } from '../../hooks/useAuth';
import { Alert } from './Alert';
import type { Product } from '../../types/api.types';

interface FavoriteButtonProps {
  product: Product;
}

export function FavoriteButton({ product }: FavoriteButtonProps): ReactNode {
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggle } = useFavorites();
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<'success' | 'error'>('success');
  const [busy, setBusy] = useState<boolean>(false);

  if (!isAuthenticated) return null;

  const active = isFavorite(product.id);

  async function handleClick(): Promise<void> {
    setBusy(true);
    setMessage(null);
    try {
      const result = await toggle(product);
      if (result.message !== null) {
        setTone('success');
        setMessage(result.message);
      }
    } catch (caught) {
      const fallback =
        caught instanceof Error ? caught.message : 'No se pudo actualizar favoritos.';
      setTone('error');
      setMessage(fallback);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="favorite-wrap">
      <button
        type="button"
        className={`favorite-btn ${active ? 'favorite-btn-active' : ''}`}
        onClick={handleClick}
        disabled={busy}
        aria-pressed={active}
        aria-label={active ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        {active ? '★' : '☆'}
      </button>
      {message && <Alert tone={tone === 'error' ? 'error' : 'info'} message={message} />}
    </div>
  );
}
