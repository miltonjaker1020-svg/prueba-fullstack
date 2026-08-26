import { Product } from './product.entity';
export declare class ProductImage {
    id: string;
    url: string;
    order: number;
    product: Product;
    productId: string;
    createdAt: Date;
}
