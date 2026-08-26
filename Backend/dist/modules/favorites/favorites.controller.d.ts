import { FavoritesService } from './favorites.service';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    findAll(currentUser: JwtPayload): Promise<import("../products/entities/product.entity").Product[]>;
    add(currentUser: JwtPayload, productId: string): Promise<import("./entities/favorite.entity").Favorite>;
    remove(currentUser: JwtPayload, productId: string): Promise<void>;
}
