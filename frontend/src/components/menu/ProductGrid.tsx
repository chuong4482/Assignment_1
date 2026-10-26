'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Plus } from 'lucide-react';
import type { Product } from '../../services/product.service';
import { formatCurrency } from '../../utils/pricing';

/**
 * [3.2] Xây dựng giao diện lưới sản phẩm (ProductGrid)
 */
export interface ProductGridProps {
  products: Product[];
  onQuickAdd?: (product: Product) => void;
}

export function ProductGrid({ products, onQuickAdd }: ProductGridProps) {
  return (
    <div className="products-grid">
      {products.map((product) => {
        const isOutOfStock = typeof product.stock === 'number' && product.stock <= 0;
        return (
          <article key={product.id} className="product-card">
            <Link
              href={`/products/${product.id}`}
              className="card-img-wrap"
              title={`Xem chi tiết & tùy chọn Size/Topping: ${product.name}`}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="card-img"
                loading="lazy"
              />
              <span className="card-category-tag">{product.category}</span>
            </Link>

            <div className="card-info">
              <div>
                <Link href={`/products/${product.id}`} className="card-name-link">
                  <h3 className="card-name">{product.name}</h3>
                </Link>
                <p className="card-desc">{product.description}</p>
              </div>

              <div>
                <div className="card-stock-row">
                  <span
                    className={`stock-pill ${
                      isOutOfStock
                        ? 'out'
                        : product.stock <= 15
                        ? 'low'
                        : 'in'
                    }`}
                  >
                    {isOutOfStock
                      ? '❌ Hết hàng'
                      : product.stock <= 15
                      ? `⚠️ Kho còn ${product.stock}`
                      : `Kho: ${product.stock}`}
                  </span>
                  <Link href={`/products/${product.id}`} className="customize-link">
                    <Eye size={12} /> Chọn Size/Topping
                  </Link>
                </div>

                <div className="card-bottom">
                  <span className="card-price">{formatCurrency(product.price)}</span>
                  <div className="card-actions">
                    <button
                      type="button"
                      className="btn-add"
                      disabled={isOutOfStock}
                      onClick={() => onQuickAdd?.(product)}
                      title={
                        isOutOfStock
                          ? 'Sản phẩm tạm hết hàng'
                          : 'Thêm nhanh 1 ly Size M vào giỏ hàng'
                      }
                      aria-label={`Thêm nhanh ${product.name}`}
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
