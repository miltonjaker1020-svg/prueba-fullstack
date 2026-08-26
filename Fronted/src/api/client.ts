import axios from 'axios';
import { API_URL } from '../config/env';
import { tokenStorage } from './token-storage';

export const UNAUTHORIZED_EVENT = 'gp:unauthorized';

const PUBLIC_AUTH_ROUTES = ['/auth/login', '/auth/register'];

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl: string = error.config?.url ?? '';

    if (
      status === 401 &&
      !PUBLIC_AUTH_ROUTES.some((route) => requestUrl.includes(route))
    ) {
      tokenStorage.clear();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }

    return Promise.reject(error);
  },
);
