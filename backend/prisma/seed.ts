import { PrismaClient } from '@prisma/client';

export interface SeedProductItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  stock: number;
  active: boolean;
}

export const SEED_PRODUCTS: SeedProductItem[] = [
  {
    id: 'p1',
    name: 'Cà phê đen',
    description: 'Cà phê nguyên chất đậm đà, hương thơm truyền thống đánh thức mọi giác quan.',
    category: 'Cà phê',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    stock: 50,
    active: true,
  },
  {
    id: 'p2',
    name: 'Americano',
    description: 'Espresso pha loãng thanh dịu, hậu vị sạch sảng khoái suốt ngày.',
    category: 'Cà phê',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
    stock: 40,
    active: true,
  },
  {
    id: 'p3',
    name: 'Americano đá',
    description: 'Espresso và nước đá mát lạnh, hậu vị sạch, dễ uống suốt ngày.',
    category: 'Cà phê',
    price: 39000,
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
    stock: 35,
    active: true,
  },
  {
    id: 'p4',
    name: 'Cappuccino',
    description: 'Espresso đậm vị hòa cùng sữa béo mịn và bọt sữa bông dày.',
    category: 'Cà phê',
    price: 55000,
    imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80',
    stock: 30,
    active: true,
  },
  {
    id: 'p5',
    name: 'Latte',
    description: 'Hương vị nhẹ nhàng, sữa tươi sánh mịn kết hợp espresso thanh dịu.',
    category: 'Cà phê',
    price: 55000,
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
    stock: 25,
    active: true,
  },
  {
    id: 'p6',
    name: 'Latte kem mịn',
    description: 'Espresso cân bằng cùng sữa tươi đánh nóng, lớp bọt sữa sánh mịn.',
    category: 'Cà phê',
    price: 49000,
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
    stock: 25,
    active: true,
  },
  {
    id: 'p7',
    name: 'Mocha',
    description: 'Sự hòa quyện tuyệt vời giữa cà phê espresso và sốt socola thơm ngậy.',
    category: 'Cà phê',
    price: 60000,
    imageUrl: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80',
    stock: 20,
    active: true,
  },
  {
    id: 'p8',
    name: 'Trà đào cam sả',
    description: 'Vị trà thanh mát hòa quyện đào ngọt lịm, hương cam sả sảng khoái.',
    category: 'Trà',
    price: 50000,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    stock: 20,
    active: true,
  },
  {
    id: 'p9',
    name: 'Matcha latte',
    description: 'Matcha Uji cao cấp nguyên chất, vị bùi béo ngọt nhẹ.',
    category: 'Matcha',
    price: 60000,
    imageUrl: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=600&q=80',
    stock: 15,
    active: true,
  },
  {
    id: 'p10',
    name: 'Chocolate',
    description: 'Sô cô la Bỉ đậm đặc đánh cùng sữa đá thơm béo.',
    category: 'Đá xay',
    price: 55000,
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
    stock: 30,
    active: true,
  },
  {
    id: 'p11',
    name: 'Chocolate đá',
    description: 'Sô cô la Bỉ đậm đà đánh cùng sữa đá thơm béo sảng khoái.',
    category: 'Đá xay',
    price: 50000,
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
    stock: 25,
    active: true,
  },
  {
    id: 'p12',
    name: 'Bạc xỉu',
    description: 'Cà phê sữa dịu nhẹ, hòa quyện cùng sữa tươi béo thơm.',
    category: 'Cà phê',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
    stock: 25,
    active: true,
  },
  {
    id: 'p13',
    name: 'Trà vải',
    description: 'Trà thanh mát kết hợp vị vải ngọt thơm, dễ uống.',
    category: 'Trà',
    price: 50000,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    stock: 20,
    active: true,
  },
];

export async function runSeed() {
  const prisma = new PrismaClient();
  try {
    for (const p of SEED_PRODUCTS) {
      await prisma.product.upsert({
        where: { id: p.id },
        update: {
          name: p.name,
          description: p.description,
          category: p.category,
          price: p.price,
          imageUrl: p.imageUrl,
          stock: p.stock,
          active: p.active,
        },
        create: {
          id: p.id,
          name: p.name,
          description: p.description,
          category: p.category,
          price: p.price,
          imageUrl: p.imageUrl,
          stock: p.stock,
          active: p.active,
        },
      });
    }
    console.log(`Đã khởi tạo ${SEED_PRODUCTS.length} sản phẩm mẫu thành công.`);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  runSeed().catch((err) => {
    console.error('Lỗi khi chạy seed:', err);
    process.exit(1);
  });
}
