import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoriesService } from '../services/categories.service';
import { productsService } from '../services/products.service';
import { ApiError } from '../api/ApiError';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';
import type { Category, CreateProductPayload, UpdateProductPayload } from '../types/api.types';

interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  images: string;
}

const EMPTY_VALUES: ProductFormValues = {
  name: '',
  description: '',
  price: '',
  stock: '',
  categoryId: '',
  images: '',
};

function imagesFromList(urls: string[]): string {
  return urls.join('\n');
}

function listFromImages(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function valuesToCreatePayload(values: ProductFormValues): CreateProductPayload {
  return {
    name: values.name.trim(),
    description: values.description.trim() || undefined,
    price: Number(values.price),
    stock: Number(values.stock),
    categoryId: values.categoryId,
    images: listFromImages(values.images),
  };
}

export function ProductFormPage(): ReactNode {
  const navigate = useNavigate();
  const { id, categoryId: fixedCategoryId } = useParams<{ id?: string; categoryId?: string }>();

  const isEditing = id !== undefined;
  const title = isEditing ? 'Editar producto' : 'Nuevo producto';

  const [values, setValues] = useState<ProductFormValues>(EMPTY_VALUES);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    async function init(): Promise<void> {
      try {
        const [cats] = await Promise.all([
          categoriesService.getAll(),
          ...(isEditing
            ? [productsService.getById(id!).then((product) => {
                if (!cancelled) {
                  setValues({
                    name: product.name,
                    description: product.description ?? '',
                    price: String(product.price),
                    stock: String(product.stock),
                    categoryId: product.categoryId,
                    images: imagesFromList(product.images.sort((a, b) => a.order - b.order).map((img) => img.url)),
                  });
                }
              })]
            : []),
        ]);
        if (!cancelled) setCategories(cats);
      } catch (caught) {
        if (!cancelled) setError(ApiError.of(caught).message);
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    }

    void init();
    return () => { cancelled = true; };
  }, [id, isEditing]);

  useEffect(() => {
    if (fixedCategoryId && !initialLoading && values.categoryId === '' && categories.length > 0) {
      const matched = categories.find((cat) => cat.id === fixedCategoryId);
      if (matched) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setValues((current) => ({ ...current, categoryId: matched.id }));
      }
    }
  }, [fixedCategoryId, initialLoading, categories, values.categoryId]);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isEditing) {
        const payload: UpdateProductPayload = valuesToCreatePayload(values);
        await productsService.update(id!, payload);
        navigate(`/productos/${id}`);
      } else {
        const payload = valuesToCreatePayload(values);
        const product = await productsService.create(payload);
        navigate(`/productos/${product.id}`);
      }
    } catch (caught) {
      setError(ApiError.of(caught).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (initialLoading) return <Spinner label="Preparando formulario…" />;
  if (error !== null && !initialLoading && categories.length === 0)
    return <section className="page"><Alert tone="error" message={error} /><button type="button" className="btn-secondary" onClick={() => window.location.reload()}>Reintentar</button></section>;

  const categoryLocked = fixedCategoryId !== undefined;

  return (
    <section className="page">
      <header className="page-header">
        <h1>{title}</h1>
      </header>

      <form className="card form product-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="name">Nombre del producto</label>
        <input id="name" name="name" type="text" value={values.name} onChange={handleChange} required minLength={2} />

        <label htmlFor="description">Descripción</label>
        <textarea id="description" name="description" value={values.description} onChange={handleChange} rows={3} />

        <div className="form-row">
          <div>
            <label htmlFor="price">Precio (COP)</label>
            <input id="price" name="price" type="number" min="0" step="0.01" value={values.price} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="stock">Stock</label>
            <input id="stock" name="stock" type="number" min="0" step="1" value={values.stock} onChange={handleChange} required />
          </div>
        </div>

        <label htmlFor="categoryId">Categoría</label>
        <select
          id="categoryId"
          name="categoryId"
          value={values.categoryId}
          onChange={handleChange}
          required
          disabled={categoryLocked}
        >
          <option value="">{categoryLocked ? 'Categoría predeterminada' : 'Selecciona una categoría…'}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {categoryLocked && <p className="field-hint">La categoría se asignó automáticamente desde la vista de categoría.</p>}

        <label htmlFor="images">URLs de imágenes (una por línea)</label>
        <textarea
          id="images"
          name="images"
          value={values.images}
          onChange={handleChange}
          placeholder={'https://ejemplo.com/imagen1.jpg\nhttps://ejemplo.com/imagen2.jpg'}
          rows={3}
        />
        <p className="field-hint">Asegúrate de copiar el enlace directo de la imagen (clic derecho → Copiar dirección de la imagen).</p>

        {error !== null && <Alert tone="error" message={error} />}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting
              ? isEditing ? 'Guardando cambios…' : 'Creando producto…'
              : isEditing ? 'Guardar cambios' : 'Crear producto'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate(isEditing && id !== undefined ? `/productos/${id}` : '/productos')}>
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
