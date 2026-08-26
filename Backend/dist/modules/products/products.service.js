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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const product_image_entity_1 = require("./entities/product-image.entity");
const categories_service_1 = require("../categories/categories.service");
let ProductsService = class ProductsService {
    productsRepository;
    productImagesRepository;
    categoriesService;
    constructor(productsRepository, productImagesRepository, categoriesService) {
        this.productsRepository = productsRepository;
        this.productImagesRepository = productImagesRepository;
        this.categoriesService = categoriesService;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const qb = this.productsRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.images', 'images')
            .orderBy('product.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        if (query.search) {
            qb.andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', {
                search: `%${query.search}%`,
            });
        }
        if (query.categoryId) {
            qb.andWhere('product.categoryId = :categoryId', {
                categoryId: query.categoryId,
            });
        }
        const [data, total] = await qb.getManyAndCount();
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const product = await this.productsRepository.findOne({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException('Producto no encontrado');
        }
        return product;
    }
    async create(dto) {
        await this.categoriesService.findOne(dto.categoryId);
        await this.assertNameNotTaken(dto.name);
        const product = this.productsRepository.create({
            name: dto.name,
            description: dto.description ?? null,
            price: dto.price,
            stock: dto.stock,
            categoryId: dto.categoryId,
            images: (dto.images ?? []).map((url, index) => this.productImagesRepository.create({ url, order: index })),
        });
        const saved = await this.productsRepository.save(product);
        return this.findOne(saved.id);
    }
    async update(id, dto) {
        const product = await this.findOne(id);
        if (dto.categoryId && dto.categoryId !== product.categoryId) {
            await this.categoriesService.findOne(dto.categoryId);
        }
        if (dto.name && dto.name.toLowerCase() !== product.name.toLowerCase()) {
            await this.assertNameNotTaken(dto.name);
        }
        const { images, ...rest } = dto;
        Object.assign(product, rest);
        if (images) {
            await this.productImagesRepository.delete({ productId: id });
            product.images = images.map((url, index) => this.productImagesRepository.create({ url, order: index }));
        }
        await this.productsRepository.save(product);
        return this.findOne(id);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productsRepository.remove(product);
    }
    async assertNameNotTaken(name) {
        const existing = await this.productsRepository.findOne({
            where: { name: (0, typeorm_2.ILike)(name) },
        });
        if (existing) {
            throw new common_1.ConflictException('Ya existe un producto con este nombre');
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(product_image_entity_1.ProductImage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        categories_service_1.CategoriesService])
], ProductsService);
//# sourceMappingURL=products.service.js.map