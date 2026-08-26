import { Product } from '../../products/entities/product.entity';
export declare class Category {
    id: string;
    name: string;
    description: string | null;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}
