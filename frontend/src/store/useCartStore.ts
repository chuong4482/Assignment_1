'use client';

import { useSyncExternalStore } from 'react';
import type { Product } from '../services/product.service';
import {
  calculateLineTotal,
  calculateUnitPrice,
  type ProductSize,
} from '../utils/pricing';

/**
 * [5.1] Quản lý State giỏ hàng (Zustand pattern + LocalStorage persistence)
 * Hỗ trợ:
 *  - Thêm sản phẩm (cộng dồn nếu trùng sản phẩm + size + topping)
 *  - Sửa số lượng (+ / -, tự xóa nếu <= 0)
 *  - Xóa từng món / Xóa toàn bộ giỏ
 *  - Tự động tính tổng tiền (totalPrice) và tổng số lượng badge (totalItems)
 */

export interface CartItem {
  cartItemId: string;
  product: Product;
  size: ProductSize;
  toppings: string[];
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (
    product: Product,
    size?: ProductSize,
    toppings?: string[],
    quantity?: number,
  ) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
}

const STORAGE_KEY = 'brewlite-cart-storage';

function buildCartItemId(productId: string, size: ProductSize, toppings: string[]): string {
  const normalizedToppings = [...toppings].sort().join('|');
  return `${productId}__${size}__${normalizedToppings}`;
}

function computeTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) =>
      sum + calculateLineTotal(item.product.price, item.size, item.toppings, item.quantity),
    0,
  );
  return { totalItems, totalPrice };
}

function loadInitialItems(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const list: CartItem[] = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.state?.items)
      ? parsed.state.items
      : [];
    return list.map((item) => {
      const size: ProductSize = item.size || 'M';
      const toppings: string[] = Array.isArray(item.toppings) ? item.toppings : [];
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const unitPrice = calculateUnitPrice(item.product.price, size, toppings);
      const lineTotal = calculateLineTotal(item.product.price, size, toppings, quantity);
      return {
        ...item,
        cartItemId: item.cartItemId || buildCartItemId(item.product.id, size, toppings),
        size,
        toppings,
        quantity,
        unitPrice,
        lineTotal,
      };
    });
  } catch {
    return [];
  }
}

function saveItemsToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { items }, version: 1 }),
    );
  } catch {
    // Ignore storage quota errors
  }
}

type Listener = () => void;
const listeners = new Set<Listener>();
let hydrated = false;

let state: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  addItem: (product, size = 'M', toppings = [], quantity = 1) => {
    ensureHydrated();
    const sortedToppings = Array.from(new Set(toppings)).sort();
    const cartItemId = buildCartItemId(product.id, size, sortedToppings);
    const validQty = Math.max(1, Math.floor(Number(quantity) || 1));
    const maxStock = typeof product.stock === 'number' && product.stock > 0 ? product.stock : 99;

    const existingIndex = state.items.findIndex((i) => i.cartItemId === cartItemId);
    let nextItems: CartItem[];

    if (existingIndex > -1) {
      nextItems = state.items.map((item, idx) => {
        if (idx !== existingIndex) return item;
        const nextQty = Math.min(maxStock, item.quantity + validQty);
        return {
          ...item,
          product,
          quantity: nextQty,
          unitPrice: calculateUnitPrice(product.price, size, sortedToppings),
          lineTotal: calculateLineTotal(product.price, size, sortedToppings, nextQty),
        };
      });
    } else {
      const initialQty = Math.min(maxStock, validQty);
      const newItem: CartItem = {
        cartItemId,
        product,
        size,
        toppings: sortedToppings,
        quantity: initialQty,
        unitPrice: calculateUnitPrice(product.price, size, sortedToppings),
        lineTotal: calculateLineTotal(product.price, size, sortedToppings, initialQty),
      };
      nextItems = [...state.items, newItem];
    }

    updateState(nextItems);
  },

  updateQuantity: (cartItemId, quantity) => {
    ensureHydrated();
    const nextQty = Math.floor(Number(quantity));
    if (nextQty <= 0) {
      const nextItems = state.items.filter((i) => i.cartItemId !== cartItemId);
      updateState(nextItems);
      return;
    }

    const nextItems = state.items.map((item) => {
      if (item.cartItemId !== cartItemId) return item;
      const maxStock =
        typeof item.product.stock === 'number' && item.product.stock > 0
          ? item.product.stock
          : 99;
      const clampedQty = Math.min(maxStock, nextQty);
      return {
        ...item,
        quantity: clampedQty,
        unitPrice: calculateUnitPrice(item.product.price, item.size, item.toppings),
        lineTotal: calculateLineTotal(
          item.product.price,
          item.size,
          item.toppings,
          clampedQty,
        ),
      };
    });

    updateState(nextItems);
  },

  removeItem: (cartItemId) => {
    ensureHydrated();
    const nextItems = state.items.filter((i) => i.cartItemId !== cartItemId);
    updateState(nextItems);
  },

  clearCart: () => {
    ensureHydrated();
    updateState([]);
  },
};

function updateState(nextItems: CartItem[]) {
  const { totalItems, totalPrice } = computeTotals(nextItems);
  state = {
    ...state,
    items: nextItems,
    totalItems,
    totalPrice,
  };
  saveItemsToStorage(nextItems);
  listeners.forEach((l) => l());
}

function ensureHydrated() {
  if (!hydrated && typeof window !== 'undefined') {
    hydrated = true;
    const saved = loadInitialItems();
    const { totalItems, totalPrice } = computeTotals(saved);
    state = {
      ...state,
      items: saved,
      totalItems,
      totalPrice,
    };
  }
}

function subscribe(listener: Listener): () => void {
  ensureHydrated();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): CartState {
  ensureHydrated();
  return state;
}

const serverSnapshot: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  addItem: () => undefined,
  updateQuantity: () => undefined,
  removeItem: () => undefined,
  clearCart: () => undefined,
};

function getServerSnapshot(): CartState {
  return serverSnapshot;
}

export function useCartStore(): CartState;
export function useCartStore<T>(selector: (state: CartState) => T): T;
export function useCartStore<T>(selector?: (state: CartState) => T): CartState | T {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return selector ? selector(snapshot) : snapshot;
}

useCartStore.getState = (): CartState => getSnapshot();
