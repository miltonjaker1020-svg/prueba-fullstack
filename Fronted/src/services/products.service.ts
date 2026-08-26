import { apiClient } from '../api/client';
import type {
  CreateProductPayload,
  Paginated,
  Product,
  ProductQuery,
  UpdateProductPayload,
} from '../types/api.types';

export const productsService = {
  async getAll(query: ProductQuery = {}): Promise<Paginated<Product>> {
    const { data } = await apiClient.get<Paginated<Product>>('/products', {
      params: query,
    });
    return data;
  },

  async getById(id: string): Promise<Product> {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
  },

  async create(payload: CreateProductPayload): Promise<Product> {
    const { data } = await apiClient.post<Product>('/products', payload);
    return data;
  },

  async update(id: string, payload: UpdateProductPayload): Promise<Product> {
    const { data } = await apiClient.patch<Product>(`/products/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },
};
