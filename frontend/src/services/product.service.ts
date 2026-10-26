/**
 * [3.1] Kết nối API danh sách & chi tiết sản phẩm (GET /products, GET /products/:id)
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  stock: number;
  active?: boolean;
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const CATEGORIES = [
  { id: 'Tất cả', label: 'Tất cả', icon: '✨' },
  { id: 'Cà phê', label: 'Cà phê', icon: '☕' },
  { id: 'Trà', label: 'Trà', icon: '🍵' },
  { id: 'Matcha', label: 'Matcha', icon: '🍃' },
  { id: 'Đá xay', label: 'Đá xay', icon: '🥤' },
] as const;

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Cà phê đen',
    description: 'Cà phê nguyên chất đậm đà, hương thơm truyền thống đánh thức mọi giác quan.',
    category: 'Cà phê',
    price: 45000,
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p2',
    name: 'Americano',
    description: 'Espresso pha loãng thanh dịu, hậu vị sạch sảng khoái suốt ngày.',
    category: 'Cà phê',
    price: 45000,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p3',
    name: 'Americano đá',
    description: 'Espresso và nước đá mát lạnh, hậu vị sạch, dễ uống suốt ngày.',
    category: 'Cà phê',
    price: 39000,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p4',
    name: 'Cappuccino',
    description: 'Espresso đậm vị hòa cùng sữa béo mịn và bọt sữa bông dày.',
    category: 'Cà phê',
    price: 55000,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p5',
    name: 'Latte',
    description: 'Hương vị nhẹ nhàng, sữa tươi sánh mịn kết hợp espresso thanh dịu.',
    category: 'Cà phê',
    price: 55000,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p6',
    name: 'Latte kem mịn',
    description: 'Espresso cân bằng cùng sữa tươi đánh nóng, lớp bọt sữa sánh mịn.',
    category: 'Cà phê',
    price: 49000,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p7',
    name: 'Mocha',
    description: 'Sự hòa quyện tuyệt vời giữa cà phê espresso và sốt socola thơm ngậy.',
    category: 'Cà phê',
    price: 60000,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p8',
    name: 'Trà đào cam sả',
    description: 'Vị trà thanh mát hòa quyện đào ngọt lịm, hương cam sả sảng khoái.',
    category: 'Trà',
    price: 50000,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p9',
    name: 'Matcha latte',
    description: 'Matcha Uji cao cấp nguyên chất, vị bùi béo ngọt nhẹ.',
    category: 'Matcha',
    price: 60000,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p10',
    name: 'Chocolate',
    description: 'Sô cô la Bỉ đậm đặc đánh cùng sữa đá thơm béo.',
    category: 'Đá xay',
    price: 55000,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p11',
    name: 'Chocolate đá',
    description: 'Sô cô la Bỉ đậm đà đánh cùng sữa đá thơm béo sảng khoái.',
    category: 'Đá xay',
    price: 50000,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p12',
    name: 'Bạc xỉu',
    description: 'Cà phê sữa dịu nhẹ, hòa quyện cùng sữa tươi béo thơm.',
    category: 'Cà phê',
    price: 45000,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p13',
    name: 'Trà vải',
    description: 'Trà thanh mát kết hợp vị vải ngọt thơm, dễ uống.',
    category: 'Trà',
    price: 50000,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
  },
];

/**
 * Lấy danh sách sản phẩm từ API GET /products (kèm fallback an toàn)
 */
export async function getProducts(params?: {
  category?: string;
  search?: string;
}): Promise<Product[]> {
  try {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'Tất cả') {
      query.set('category', params.category);
    }
    if (params?.search?.trim()) {
      query.set('search', params.search.trim());
    }
    const qs = query.toString();
    const res = await fetch(`${API_BASE_URL}/products${qs ? `?${qs}` : ''}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      return data;
    }
    return FALLBACK_PRODUCTS;
  } catch {
    return FALLBACK_PRODUCTS.filter((p) => {
      const matchCat =
        !params?.category ||
        params.category === 'Tất cả' ||
        p.category.toLowerCase() === params.category.toLowerCase();
      const matchSearch =
        !params?.search ||
        p.name.toLowerCase().includes(params.search.trim().toLowerCase());
      return matchCat && matchSearch;
    });
  }
}

/**
 * Lấy thông tin chi tiết 1 sản phẩm từ API GET /products/:id
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      return (await res.json()) as Product;
    }
  } catch {
    // Fallback tìm trong danh sách mẫu nếu offline
  }
  return (
    FALLBACK_PRODUCTS.find(
      (p) => p.id === id || p.name.toLowerCase() === decodeURIComponent(id).toLowerCase(),
    ) || null
  );
}
