'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react';
import { getProductById, type Product } from '../../../services/product.service';
import { SizeSelector } from '../../../components/product-detail/SizeSelector';
import { ToppingSelector } from '../../../components/product-detail/ToppingSelector';
import { CartBadge } from '../../../components/cart/CartSummary';
import { useCartStore } from '../../../store/useCartStore';
import {
  SIZE_SURCHARGE,
  TOPPING_PRICE,
  calculateLineTotal,
  calculateUnitPrice,
  formatCurrency,
  type ProductSize,
} from '../../../utils/pricing';

/**
 * [4.1] Giao diện trang chi tiết sản phẩm (/products/[id])
 * - Hiển thị thông tin sản phẩm
 * - Chọn Size (S / M / L) và Topping
 * - Tính giá động theo tùy chọn và số lượng
 * - Thêm vào giỏ hàng (Zustand store)
 */
export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [size, setSize] = useState<ProductSize>('M');
  const [toppings, setToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [toast, setToast] = useState<string>('');

  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!productId) return;
    let active = true;
    setLoading(true);
    getProductById(productId)
      .then((data) => {
        if (active) setProduct(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <>
        <header className="site-header">
          <div className="nav-wrapper">
            <Link href="/" className="brand-logo">
              <span className="brand-icon">☕</span>
              <span>BrewLite</span>
            </Link>
            <CartBadge />
          </div>
        </header>
        <main className="site-container">
          <div className="menu-state-box">
            <div className="state-icon">⏳</div>
            <h3>Đang tải thông tin sản phẩm...</h3>
          </div>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <header className="site-header">
          <div className="nav-wrapper">
            <Link href="/" className="brand-logo">
              <span className="brand-icon">☕</span>
              <span>BrewLite</span>
            </Link>
            <CartBadge />
          </div>
        </header>
        <main className="site-container">
          <div className="menu-state-box">
            <div className="state-icon">🔍</div>
            <h3>Không tìm thấy sản phẩm</h3>
            <p>Sản phẩm bạn đang tìm không tồn tại hoặc đã ngừng kinh doanh.</p>
            <Link href="/" className="btn-primary">
              ← Quay lại thực đơn
            </Link>
          </div>
        </main>
      </>
    );
  }

  const sizeExtra = SIZE_SURCHARGE[size];
  const toppingExtra = toppings.length * TOPPING_PRICE;
  const unitPrice = calculateUnitPrice(product.price, size, toppings);
  const totalPrice = calculateLineTotal(product.price, size, toppings, quantity);
  const maxStock = typeof product.stock === 'number' && product.stock > 0 ? product.stock : 0;
  const isOutOfStock = maxStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, size, toppings, quantity);
    setToast(
      `Đã thêm ${quantity} ly "${product.name}" (Size ${size}${
        toppings.length ? `, ${toppings.join(', ')}` : ''
      }) vào giỏ hàng!`,
    );
    setTimeout(() => setToast(''), 3000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, size, toppings, quantity);
    router.push('/cart');
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
            <Link href="/cart">Giỏ hàng</Link>
          </nav>
          <CartBadge />
        </div>
      </header>

      <main className="site-container">
        <div className="breadcrumb-bar">
          <Link href="/" className="back-link">
            <ArrowLeft size={15} /> Quay lại thực đơn
          </Link>
        </div>

        <section className="detail-grid">
          <div className="detail-image-box">
            <img src={product.imageUrl} alt={product.name} />
            <span className="card-category-tag">{product.category}</span>
          </div>

          <div className="detail-content">
            <div className="detail-heading">
              <span className={`stock-pill ${isOutOfStock ? 'out' : 'in'}`}>
                {isOutOfStock ? '❌ Hết hàng' : `📦 Tồn kho: còn ${product.stock} ly`}
              </span>
              <h1>{product.name}</h1>
              <p>{product.description}</p>
            </div>

            <div className="base-price-row">
              <span className="base-price-value">{formatCurrency(product.price)}</span>
              <span className="base-price-note">(Giá gốc cho Size S tiêu chuẩn)</span>
            </div>

            <SizeSelector value={size} onChange={setSize} />

            <ToppingSelector selectedToppings={toppings} onChange={setToppings} />

            <div className="price-breakdown-box">
              <div className="breakdown-line">
                <span>Giá gốc sản phẩm</span>
                <strong>{formatCurrency(product.price)}</strong>
              </div>
              <div className="breakdown-line">
                <span>Phụ thu kích cỡ (Size {size})</span>
                <strong>+{formatCurrency(sizeExtra)}</strong>
              </div>
              <div className="breakdown-line">
                <span>
                  Topping ({toppings.length > 0 ? toppings.join(', ') : 'Không chọn'})
                </span>
                <strong>+{formatCurrency(toppingExtra)}</strong>
              </div>
              <div className="breakdown-line">
                <span>Đơn giá 1 ly × {quantity} ly</span>
                <strong>
                  {formatCurrency(unitPrice)} × {quantity}
                </strong>
              </div>
              <div className="breakdown-line total">
                <span>Tổng cộng tạm tính</span>
                <span data-testid="detail-total-price">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <div className="detail-footer-actions">
              <div className="qty-stepper" aria-label="Chọn số lượng">
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Giảm số lượng"
                >
                  <Minus size={15} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  type="button"
                  disabled={isOutOfStock || quantity >= maxStock}
                  onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                  aria-label="Tăng số lượng"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                type="button"
                className="btn-add-detail"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
              >
                <ShoppingBag size={17} />
                {isOutOfStock
                  ? 'Sản phẩm đã hết hàng'
                  : `Thêm vào giỏ • ${formatCurrency(totalPrice)}`}
              </button>

              <button
                type="button"
                className="btn-buy-now"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
              >
                Mua ngay
              </button>
            </div>
          </div>
        </section>
      </main>

      {toast && (
        <div className="toast-banner" role="status">
          <span>✅ {toast}</span>
          <Link href="/cart" style={{ textDecoration: 'underline', marginLeft: 6 }}>
            Mở giỏ hàng
          </Link>
        </div>
      )}
    </>
  );
}
