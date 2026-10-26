'use client';

import React from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '../../store/useCartStore';
import { formatCurrency } from '../../utils/pricing';

/**
 * [5.2] Thao tác giỏ hàng trên từng sản phẩm (Tăng/Giảm số lượng, Xóa món)
 */
export interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const maxStock =
    typeof item.product.stock === 'number' && item.product.stock > 0
      ? item.product.stock
      : 99;
  const isAtMaxStock = item.quantity >= maxStock;

  return (
    <div className="cart-row-card">
      <Link href={`/products/${item.product.id}`} className="cart-row-thumb">
        <img src={item.product.imageUrl} alt={item.product.name} />
      </Link>

      <div className="cart-row-info">
        <div className="cart-row-header">
          <Link href={`/products/${item.product.id}`} className="cart-row-title">
            {item.product.name}
          </Link>
          <span className="cart-row-category">{item.product.category}</span>
        </div>

        <div className="cart-row-variants">
          <span className="variant-pill">Size {item.size}</span>
          {item.toppings.length > 0 ? (
            item.toppings.map((t) => (
              <span key={t} className="variant-pill topping">
                + {t}
              </span>
            ))
          ) : (
            <span className="variant-none">Không thêm topping</span>
          )}
        </div>

        <div className="cart-row-unit">
          Đơn giá: <strong>{formatCurrency(item.unitPrice)}</strong> / ly
        </div>
      </div>

      <div className="cart-row-controls">
        <div className="qty-stepper">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
            aria-label="Giảm số lượng"
            title="Giảm 1 ly"
          >
            <Minus size={14} />
          </button>
          <span className="qty-value">{item.quantity}</span>
          <button
            type="button"
            disabled={isAtMaxStock}
            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
            aria-label="Tăng số lượng"
            title={isAtMaxStock ? `Tối đa ${maxStock} ly theo tồn kho` : 'Tăng 1 ly'}
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="cart-row-total">{formatCurrency(item.lineTotal)}</div>

        <button
          type="button"
          className="btn-remove-item"
          onClick={() => onRemove(item.cartItemId)}
          aria-label={`Xóa ${item.product.name}`}
          title="Xóa món khỏi giỏ"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
