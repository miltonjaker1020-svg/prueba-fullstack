import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { favoritesService } from '../services/favorites.service';
import { ApiError } from '../api/ApiError';
import { useAuth } from '../hooks/useAuth';
import type { Product } from '../types/api.types';

interface ToggleResult {
  ok: boolean;
  message: string | null;
}

export interface FavoritesContextValue {
  favorites: Product[];
  favoriteIds: ReadonlySet<string>;
  isFavorite: (productId: string) => boolean;
  toggle: (product: Product) => Promise<ToggleResult>;
  refresh: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

// eslint-disable-next-line react-refresh/only-export-components
export const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }): ReactNode {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const list = await favoritesService.getAll();
      setFavorites(list);
    } catch (caught) {
      setError(ApiError.of(caught).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFavorites([]);
      return;
    }
    void refresh();
  }, [isAuthenticated, refresh]);

  const toggle = useCallback(
    async (product: Product): Promise<ToggleResult> => {
      const wasFavorite = favorites.some((fav) => fav.id === product.id);
      try {
        if (wasFavorite) {
          await favoritesService.remove(product.id);
          setFavorites((current) => current.filter((fav) => fav.id !== product.id));
          return { ok: true, message: `${product.name} salió de tus favoritos.` };
        }
        await favoritesService.add(product.id);
        setFavorites((current) => [product, ...current]);
        return { ok: true, message: `${product.name} se agregó a tus favoritos.` };
      } catch (caught) {
        const apiError = ApiError.of(caught);
        if (apiError.status === 409) {
          if (!wasFavorite) {
            setFavorites((current) =>
              current.some((fav) => fav.id === product.id) ? current : [product, ...current],
            );
          }
          return {
            ok: true,
            message: `${product.name} ya estaba en tus favoritos.`,
          };
        }
        if (apiError.status === 404 && wasFavorite) {
          setFavorites((current) => current.filter((fav) => fav.id !== product.id));
          return { ok: true, message: 'El producto ya no está en tus favoritos.' };
        }
        throw apiError;
      }
    },
    [favorites],
  );

  const value = useMemo<FavoritesContextValue>(() => {
    const ids = new Set(favorites.map((fav) => fav.id));
    return {
      favorites,
      favoriteIds: ids,
      isFavorite: (productId: string) => ids.has(productId),
      toggle,
      refresh,
      loading,
      error,
    };
  }, [favorites, toggle, refresh, loading, error]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

