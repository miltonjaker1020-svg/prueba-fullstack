import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import type { Category } from '../../types/api.types';

interface ProductFiltersProps {
  search: string;
  categoryId: string;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function ProductFilters({
  search,
  categoryId,
  categories,
  onSearchChange,
  onCategoryChange,
}: ProductFiltersProps): ReactNode {
  function handleSearch(event: ChangeEvent<HTMLInputElement>): void {
    onSearchChange(event.target.value);
  }

  function handleCategory(event: ChangeEvent<HTMLSelectElement>): void {
    onCategoryChange(event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
  }

  return (
    <form className="filters" onSubmit={handleSubmit}>
      <input
        type="search"
        placeholder="Buscar por nombre o descripción…"
        value={search}
        onChange={handleSearch}
        aria-label="Buscar productos"
      />
      <select
        value={categoryId}
        onChange={handleCategory}
        aria-label="Filtrar por categoría"
      >
        <option value="">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </form>
  );
}
