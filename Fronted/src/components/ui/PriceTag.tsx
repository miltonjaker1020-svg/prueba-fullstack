import type { ReactNode } from 'react';
import { formatPrice } from '../../lib/format';

interface PriceTagProps {
  value: number;
}

export function PriceTag({ value }: PriceTagProps): ReactNode {
  return <span className="price-tag">{formatPrice(value)}</span>;
}
