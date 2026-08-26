import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
export declare class Favorite {
    id: string;
    user: User;
    userId: string;
    product: Product;
    productId: string;
    createdAt: Date;
}
