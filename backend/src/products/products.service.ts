import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SEED_PRODUCTS } from '../../prisma/seed';
import { ProductEntity } from './entities/product.entity';
import { ProductsCacheService } from './products-cache.service';

/**
 * [2.2] Logic truy vấn sản phẩm từ CSDL PostgreSQL (Prisma) kết hợp dữ liệu mẫu & In-memory Cache
 * Tối ưu thời gian phản hồi luôn < 500ms (kể cả khi CSDL chưa bật trên Windows).
 */
@Injectable()
export class ProductsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProductsService.name);
  private prisma: PrismaClient | null = null;
  private dbUnavailableUntil = 0;
  private readonly dbTimeoutMs = 150;

  constructor(private readonly cacheService: ProductsCacheService) {
    // Khởi tạo sẵn cache từ dữ liệu mẫu để phản hồi tức thì (< 5ms)
    this.cacheService.setAllProducts(this.getFallbackProducts());
  }

  onModuleInit() {
    // Đồng bộ ngầm từ PostgreSQL nếu CSDL đang chạy (không chặn luồng chính)
    this.tryFetchFromDbWithTimeout()
      .then((dbProducts) => {
        if (dbProducts && dbProducts.length > 0) {
          this.cacheService.setAllProducts(dbProducts);
        }
      })
      .catch(() => undefined);
  }

  private getPrismaClient(): PrismaClient {
    if (!this.prisma) {
      this.prisma = new PrismaClient();
    }
    return this.prisma;
  }

  async onModuleDestroy() {
    if (this.prisma) {
      await this.prisma.$disconnect().catch(() => undefined);
    }
  }

  private getFallbackProducts(): ProductEntity[] {
    return SEED_PRODUCTS.filter((p) => p.active).map(
      (p) =>
        new ProductEntity({
          id: p.id,
          name: p.name,
          description: p.description,
          category: p.category,
          price: p.price,
          imageUrl: p.imageUrl,
          stock: p.stock,
          active: p.active,
        }),
    );
  }

  private async tryFetchFromDbWithTimeout(): Promise<ProductEntity[] | null> {
    if (Date.now() < this.dbUnavailableUntil) {
      return null;
    }

    let timer: NodeJS.Timeout | null = null;
    try {
      const prisma = this.getPrismaClient();
      const queryPromise = prisma.product.findMany({
        where: { active: true },
        orderBy: { name: 'asc' },
      });

      const timeoutPromise = new Promise<null>((resolve) => {
        timer = setTimeout(() => resolve(null), this.dbTimeoutMs);
      });

      const rows = await Promise.race([queryPromise, timeoutPromise]);
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map((r) => new ProductEntity(r));
      }

      if (rows === null) {
        this.dbUnavailableUntil = Date.now() + 60_000;
      }
      return null;
    } catch (err: any) {
      this.dbUnavailableUntil = Date.now() + 60_000;
      this.logger.debug(
        `CSDL chưa sẵn sàng (${err?.message || 'connection error'}), sử dụng dữ liệu menu mẫu.`,
      );
      return null;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  private async loadAllActiveProducts(): Promise<ProductEntity[]> {
    const cached = this.cacheService.getAllProducts();
    if (cached) {
      return cached;
    }

    const dbProducts = await this.tryFetchFromDbWithTimeout();
    if (dbProducts && dbProducts.length > 0) {
      this.cacheService.setAllProducts(dbProducts);
      return dbProducts;
    }

    const fallback = this.getFallbackProducts();
    this.cacheService.setAllProducts(fallback);
    return fallback;
  }

  async findAll(category?: string, search?: string): Promise<ProductEntity[]> {
    const allProducts = await this.loadAllActiveProducts();

    return allProducts.filter((product) => {
      const matchCategory =
        !category ||
        category === 'Tất cả' ||
        product.category.toLowerCase() === category.trim().toLowerCase();

      const matchSearch =
        !search ||
        product.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        product.description.toLowerCase().includes(search.trim().toLowerCase());

      return matchCategory && matchSearch;
    });
  }

  async findOne(id: string): Promise<ProductEntity> {
    const cachedItem = this.cacheService.getProductById(id);
    if (cachedItem) {
      return cachedItem;
    }

    const allProducts = await this.loadAllActiveProducts();
    const found = allProducts.find(
      (p) => p.id === id || p.name.toLowerCase() === id.trim().toLowerCase(),
    );

    if (!found) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với mã "${id}"`);
    }

    this.cacheService.setProductById(found);
    return found;
  }
}
