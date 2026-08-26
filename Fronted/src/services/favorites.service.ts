import { apiClient } from '../api/client';
import type { Product } from '../types/api.types';

export const favoritesService = {
  async getAll(): Promise<Product[]> {
    const { data } = await apiClient.get<Product[]>('/favorites');
    return data;
  },

  async add(productId: string): Promise<void> {
    await apiClient.post(`/favorites/${productId}`);
  },

  async remove(productId: string): Promise<void> {
    await apiClient.delete(`/favorites/${productId}`);
  },
};
