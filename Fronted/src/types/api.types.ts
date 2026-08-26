import type { Product, Role, User, Category } from './domain.types';

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type RegisterPayload = Pick<User, 'name' | 'email'> & {
  password: string;
  role?: Role;
};

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  images?: string[];
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export type ProductQuery = Partial<
  Pick<CreateProductPayload, 'categoryId'> & {
    search: string;
    page: number;
    limit: number;
  }
>;

export type { Product, Role, User, Category };
