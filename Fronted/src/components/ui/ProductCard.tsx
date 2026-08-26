import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SafeImage } from './SafeImage';
import { PriceTag } from './PriceTag';
import { FavoriteButton } from './FavoriteButton';
import type { Product } from '../../types/api.types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps): ReactNode {
  const cover = product.images[0]?.url;

  return (
    <article className="product-card">
      <Link to={`/productos/${product.id}`} className="product-card-link">
        <div className="product-card-media">
          {cover ? (
            <SafeImage src={cover} alt={product.name} />
          ) : (
            <div className="safe-image-fallback" aria-hidden="true">📦</div>
          )}
        </div>
        <div className="product-card-body">
          <h3>{product.name}</h3>
          <p className="product-card-category">{product.category.name}</p>
          <PriceTag value={product.price} />
        </div>
      </Link>
      <div className="product-card-footer">
        <span className={`stock-badge ${product.stock > 0 ? '' : 'stock-out'}`}>
          {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
        </span>
        <FavoriteButton product={product} />
      </div>
    </article>
  );
}
