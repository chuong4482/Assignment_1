import { Injectable } from '@nestjs/common';
import { envConfig } from '../config/env.config';
import { ProductEntity } from './entities/product.entity';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

/**
 * [2.3] In-memory Cache tối ưu phản hồi < 500ms cho danh sách & chi tiết sản phẩm
 */
@Injectable()
export class ProductsCacheService {
  private readonly cache = new Map<string, CacheEntry<any>>();
  private readonly ttlMs = envConfig.productsCacheTtlMs;

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, customTtlMs?: number): void {
    const ttl = customTtlMs ?? this.ttlMs;
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
    });
  }

  getAllProducts(): ProductEntity[] | null {
    return this.get<ProductEntity[]>('products:all');
  }

  setAllProducts(products: ProductEntity[]): void {
    this.set('products:all', products);
    for (const product of products) {
      this.set(`products:id:${product.id}`, product);
    }
  }

  getProductById(id: string): ProductEntity | null {
    return this.get<ProductEntity>(`products:id:${id}`);
  }

  setProductById(product: ProductEntity): void {
    this.set(`products:id:${product.id}`, product);
  }

  clear(): void {
    this.cache.clear();
  }
}
