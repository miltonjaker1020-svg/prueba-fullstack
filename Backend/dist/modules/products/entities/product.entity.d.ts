import { Category } from '../../categories/entities/category.entity';
import { ProductImage } from './product-image.entity';
export declare class Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    category: Category;
    categoryId: string;
    images: ProductImage[];
    createdAt: Date;
    updatedAt: Date;
}
