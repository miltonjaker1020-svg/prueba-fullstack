"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const favorite_entity_1 = require("./entities/favorite.entity");
const products_service_1 = require("../products/products.service");
let FavoritesService = class FavoritesService {
    favoritesRepository;
    productsService;
    constructor(favoritesRepository, productsService) {
        this.favoritesRepository = favoritesRepository;
        this.productsService = productsService;
    }
    async findAllByUser(userId) {
        const favorites = await this.favoritesRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        return favorites.map((favorite) => favorite.product);
    }
    async add(userId, productId) {
        await this.productsService.findOne(productId);
        const existing = await this.favoritesRepository.findOne({
            where: { userId, productId },
        });
        if (existing) {
            throw new common_1.ConflictException('El producto ya está en favoritos');
        }
        const favorite = this.favoritesRepository.create({ userId, productId });
        return this.favoritesRepository.save(favorite);
    }
    async remove(userId, productId) {
        const favorite = await this.favoritesRepository.findOne({
            where: { userId, productId },
        });
        if (!favorite) {
            throw new common_1.NotFoundException('Este producto no está en tus favoritos');
        }
        await this.favoritesRepository.remove(favorite);
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorite)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        products_service_1.ProductsService])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map