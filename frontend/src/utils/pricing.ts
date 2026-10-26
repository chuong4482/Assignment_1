/**
 * [4.3] Logic tính giá động theo Size & Topping
 * Công thức:
 *   Đơn giá 1 ly = Giá gốc + Phụ thu Size + (Số lượng Topping * 7.000đ)
 *   Thành tiền dòng = Đơn giá 1 ly * Số lượng
 */

export type ProductSize = 'S' | 'M' | 'L';

export const SIZE_SURCHARGE: Record<ProductSize, number> = {
  S: 0,
  M: 5000,
  L: 10000,
};

export const SIZE_OPTIONS: { id: ProductSize; label: string; surcharge: number; subLabel: string }[] = [
  { id: 'S', label: 'Size S (Nhỏ)', surcharge: 0, subLabel: '+0 ₫' },
  { id: 'M', label: 'Size M (Vừa)', surcharge: 5000, subLabel: '+5.000 ₫' },
  { id: 'L', label: 'Size L (Lớn)', surcharge: 10000, subLabel: '+10.000 ₫' },
];

export const TOPPING_PRICE = 7000;

export const ALLOWED_TOPPINGS = ['Trân châu', 'Kem cheese', 'Shot espresso'] as const;

export const TOPPING_OPTIONS: { name: string; price: number; description: string }[] = [
  { name: 'Trân châu', price: TOPPING_PRICE, description: 'Trân châu đen dai giòn truyền thống' },
  { name: 'Kem cheese', price: TOPPING_PRICE, description: 'Lớp kem phô mai mặn béo sánh mịn' },
  { name: 'Shot espresso', price: TOPPING_PRICE, description: 'Thêm 1 shot cà phê nguyên chất đậm vị' },
];

/**
 * Tính đơn giá 1 ly dựa trên giá gốc, size và danh sách topping
 */
export function calculateUnitPrice(
  basePrice: number,
  size: ProductSize = 'M',
  toppings: string[] = [],
): number {
  const validBase = Number.isFinite(basePrice) && basePrice >= 0 ? basePrice : 0;
  const sizeExtra = SIZE_SURCHARGE[size] ?? 0;
  const uniqueValidToppings = Array.from(new Set(toppings)).filter((t) =>
    ALLOWED_TOPPINGS.includes(t as (typeof ALLOWED_TOPPINGS)[number]),
  );
  const toppingExtra = uniqueValidToppings.length * TOPPING_PRICE;
  return validBase + sizeExtra + toppingExtra;
}

/**
 * Tính tổng tiền cho một dòng sản phẩm (Đơn giá 1 ly * Số lượng)
 */
export function calculateLineTotal(
  basePrice: number,
  size: ProductSize = 'M',
  toppings: string[] = [],
  quantity: number = 1,
): number {
  const validQty = Math.max(1, Math.floor(Number(quantity) || 1));
  return calculateUnitPrice(basePrice, size, toppings) * validQty;
}

/**
 * Định dạng tiền tệ VNĐ (VD: 45.000 ₫)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}
