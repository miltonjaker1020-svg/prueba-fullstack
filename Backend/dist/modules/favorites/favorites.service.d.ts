import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { ProductsService } from '../products/products.service';
export declare class FavoritesService {
    private readonly favoritesRepository;
    private readonly productsService;
    constructor(favoritesRepository: Repository<Favorite>, productsService: ProductsService);
    findAllByUser(userId: string): Promise<import("../products/entities/product.entity").Product[]>;
    add(userId: string, productId: string): Promise<Favorite>;
    remove(userId: string, productId: string): Promise<void>;
}
