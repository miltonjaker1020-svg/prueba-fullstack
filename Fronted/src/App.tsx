import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AppLayout } from './components/layout/AppLayout';
import { RequireAuth } from './components/routing/RequireAuth';
import { RequireRole } from './components/routing/RequireRole';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { CategoryFormPage } from './pages/CategoryFormPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductFormPage } from './pages/ProductFormPage';
import { FavoritesPage } from './pages/FavoritesPage';

export default function App(): ReactNode {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <FavoritesProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registro" element={<RegisterPage />} />
                <Route index element={<Navigate to="/productos" replace />} />

                <Route element={<RequireAuth />}>
                  <Route path="/favoritos" element={<FavoritesPage />} />
                  <Route path="/productos/nuevo" element={<ProductFormPage />} />
                  <Route path="/productos/:id/editar" element={<ProductFormPage />} />
                  <Route path="/categorias/:categoryId/nuevo-producto" element={<ProductFormPage />} />
                </Route>

                <Route element={<RequireRole />}>
                  <Route path="/categorias/nueva" element={<CategoryFormPage />} />
                </Route>

                <Route path="/productos" element={<ProductsPage />} />
                <Route path="/productos/:id" element={<ProductDetailPage />} />
                <Route path="/categorias" element={<CategoriesPage />} />
                <Route path="/categorias/:id" element={<CategoryDetailPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/productos" replace />} />
            </Routes>
          </FavoritesProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
