import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { CategoriesService } from '../categories/categories.service';
export declare class ProductsService {
    private readonly productsRepository;
    private readonly productImagesRepository;
    private readonly categoriesService;
    constructor(productsRepository: Repository<Product>, productImagesRepository: Repository<ProductImage>, categoriesService: CategoriesService);
    findAll(query: QueryProductDto): Promise<{
        data: Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Product>;
    create(dto: CreateProductDto): Promise<Product>;
    update(id: string, dto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<void>;
    private assertNameNotTaken;
}
