import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import type { FavoritesContextValue } from '../context/FavoritesContext';

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (context === null) {
    throw new Error('useFavorites debe usarse dentro de un <FavoritesProvider>');
  }
  return context;
}
