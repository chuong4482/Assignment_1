'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CartItemRow } from '../../components/cart/CartItemRow';
import { CartBadge, CartSummary } from '../../components/cart/CartSummary';
import { useCartStore } from '../../store/useCartStore';

/**
 * [5.2] Trang Giỏ hàng (/cart)
 * - Hiển thị danh sách các sản phẩm đã chọn cùng Size & Topping
 * - Cho phép tăng/giảm số lượng, xóa từng món hoặc xóa toàn bộ giỏ hàng
 * - Tự động tính tổng tiền và cập nhật CartBadge theo thời gian thực
 */
export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } =
    useCartStore();
  const [orderNotice, setOrderNotice] = useState<string>('');

  const handleCheckout = () => {
    setOrderNotice(
      `Đặt món thành công (${totalItems} ly)! Cảm ơn bạn đã trải nghiệm BrewLite.`,
    );
    clearCart();
  };

  return (
    <>
      <header className="site-header">
        <div className="nav-wrapper">
          <Link href="/" className="brand-logo">
            <span className="brand-icon">☕</span>
            <span>BrewLite</span>
          </Link>
          <nav className="nav-links">
            <Link href="/">Thực đơn</Link>
            <Link href="/cart" className="active">
              Giỏ hàng ({totalItems})
            </Link>
          </nav>
          <CartBadge />
        </div>
      </header>

      <main className="site-container">
        <div className="breadcrumb-bar">
          <Link href="/" className="back-link">
            <ArrowLeft size={15} /> Tiếp tục chọn món
          </Link>
        </div>

        <div className="menu-head">
          <div className="menu-title">
            <h2>Giỏ hàng của bạn</h2>
            <p>
              {totalItems > 0
                ? `Bạn đang có ${totalItems} ly đồ uống trong giỏ hàng`
                : 'Chưa có sản phẩm nào trong giỏ hàng'}
            </p>
          </div>
        </div>

        {orderNotice && (
          <div
            className="menu-state-box"
            style={{
              marginBottom: 20,
              background: '#ecfdf5',
              borderColor: '#34d399',
              color: '#065f46',
            }}
          >
            <div className="state-icon">🎉</div>
            <h3>{orderNotice}</h3>
            <p>Bạn có thể tiếp tục chọn thêm đồ uống yêu thích tại thực đơn.</p>
            <Link href="/" className="btn-primary">
              Quay lại thực đơn
            </Link>
          </div>
        )}

        {items.length === 0 ? (
          <div className="menu-state-box">
            <div className="state-icon">🛒</div>
            <h3>Giỏ hàng của bạn đang trống</h3>
            <p>Hãy khám phá thực đơn BrewLite và chọn món đồ uống yêu thích của bạn nhé!</p>
            <Link href="/" className="btn-primary">
              Khám phá thực đơn ngay
            </Link>
          </div>
        ) : (
          <div className="cart-page-layout">
            <div className="cart-items-column">
              {items.map((item) => (
                <CartItemRow
                  key={item.cartItemId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <CartSummary
              totalItems={totalItems}
              totalLines={items.length}
              totalPrice={totalPrice}
              onClearCart={clearCart}
              onCheckout={handleCheckout}
            />
          </div>
        )}
      </main>
    </>
  );
}
