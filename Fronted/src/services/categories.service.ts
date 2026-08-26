import { apiClient } from '../api/client';
import type { Category, CreateCategoryPayload } from '../types/api.types';

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const { data } = await apiClient.get<Category[]>('/categories');
    return data;
  },

  async getById(id: string): Promise<Category> {
    const { data } = await apiClient.get<Category>(`/categories/${id}`);
    return data;
  },

  async create(payload: CreateCategoryPayload): Promise<Category> {
    const { data } = await apiClient.post<Category>('/categories', payload);
    return data;
  },
};
