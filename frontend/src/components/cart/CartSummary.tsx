'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { formatCurrency } from '../../utils/pricing';

/**
 * [5.3] Huy hiệu số lượng giỏ hàng (CartBadge) trên thanh điều hướng
 */
export function CartBadge() {
  const totalItems = useCartStore((s) => s.totalItems);
  const totalPrice = useCartStore((s) => s.totalPrice);

  return (
    <Link href="/cart" className="cart-badge-btn" title="Xem giỏ hàng">
      <div className="cart-icon-wrap">
        <ShoppingBag size={18} />
        <span className="badge-count" data-testid="cart-badge-count">
          {totalItems}
        </span>
      </div>
      <div className="cart-badge-text">
        <span>Giỏ hàng</span>
        {totalItems > 0 && <small>{formatCurrency(totalPrice)}</small>}
      </div>
    </Link>
  );
}

/**
 * [5.3] Bảng tính tổng tiền giỏ hàng (CartSummary)
 */
export interface CartSummaryProps {
  totalItems: number;
  totalLines: number;
  totalPrice: number;
  onClearCart?: () => void;
  onCheckout?: () => void;
}

export function CartSummary({
  totalItems,
  totalLines,
  totalPrice,
  onClearCart,
  onCheckout,
}: CartSummaryProps) {
  return (
    <aside className="cart-summary-card">
      <h3 className="summary-heading">Tóm tắt đơn hàng</h3>

      <div className="summary-rows">
        <div className="summary-row">
          <span>Số dòng sản phẩm</span>
          <strong>{totalLines} món</strong>
        </div>
        <div className="summary-row">
          <span>Tổng số lượng ly</span>
          <strong>{totalItems} ly</strong>
        </div>
        <div className="summary-row">
          <span>Tạm tính</span>
          <strong>{formatCurrency(totalPrice)}</strong>
        </div>
        <div className="summary-row">
          <span>Phí phục vụ</span>
          <strong className="free-tag">Miễn phí</strong>
        </div>
      </div>

      <div className="summary-divider" />

      <div className="summary-total-row">
        <span>Tổng thanh toán</span>
        <strong className="grand-total-price">{formatCurrency(totalPrice)}</strong>
      </div>

      <button type="button" className="btn-checkout-full" onClick={onCheckout}>
        Xác nhận đặt món • {formatCurrency(totalPrice)}
      </button>

      <div className="summary-sub-actions">
        <Link href="/" className="btn-continue-shopping">
          ← Tiếp tục chọn thêm món
        </Link>
        {onClearCart && (
          <button type="button" className="btn-clear-cart" onClick={onClearCart}>
            <Trash2 size={14} /> Xóa toàn bộ giỏ
          </button>
        )}
      </div>
    </aside>
  );
}
