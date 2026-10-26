# ☕ BrewLite — Hệ thống đặt đồ uống trực tuyến

Dự án **BrewLite** được xây dựng theo kiến trúc **Monorepo** (NPM Workspaces) gồm 2 ứng dụng:
- **`backend/` (NestJS + Prisma + PostgreSQL)**: Cung cấp RESTful API (`GET /`, `GET /products`, `GET /products/:id`, ...) kèm In-Memory Cache và Interceptor đo thời gian phản hồi `< 500ms`.
- **`frontend/` (Next.js 14 App Router + React 18 + Zustand)**: Giao diện khách hàng gồm Trang Menu (`/`), Trang Chi tiết & Tùy chọn Size/Topping (`/products/[id]`), và Trang Giỏ hàng (`/cart`).

---

## 📁 Cấu trúc thư mục (Task 1 -> Task 5)

```text
brewlite/
├── package.json                                  # [1.1] Cấu trúc Monorepo (workspaces: backend, frontend)
├── .env.example                                  # [1.2] Cấu hình biến môi trường mẫu
├── .gitignore                                    # [1.2] Cấu hình Git
├── docker-compose.yml                            # [9.3] Đóng gói DevOps (Frontend, Backend, PostgreSQL)
├── README.md                                     # Tài liệu hướng dẫn & bàn giao
├── backend/                                      # [1.1] Thư mục Backend (NestJS)
│   ├── prisma/
│   │   ├── schema.prisma                         # [2.1] Thiết kế Database Schema
│   │   └── seed.ts                               # [2.1] Dữ liệu mẫu Menu đồ uống
│   └── src/
│       ├── config/env.config.ts                  # [1.2] Cấu hình môi trường Backend
│       ├── app.controller.ts & app.service.ts    # [1.3] Kiểm tra chạy thử (GET / -> Hello World)
│       ├── common/interceptors/
│       │   └── response-time.interceptor.ts      # [2.3] Đo & tối ưu thời gian phản hồi (< 500ms)
│       └── products/
│           ├── entities/product.entity.ts        # [2.1] Thiết kế Model / Entity sản phẩm
│           ├── products.controller.ts            # [2.2] API GET /products, GET /products/:id
│           ├── products.service.ts               # [2.2] Logic truy vấn sản phẩm (CSDL + dữ liệu mẫu)
│           └── products-cache.service.ts         # [2.3] In-memory Cache tối ưu phản hồi < 500ms
└── frontend/                                     # [1.1] Thư mục Frontend (Next.js)
    └── src/
        ├── services/product.service.ts           # [3.1] Kết nối API danh sách & chi tiết sản phẩm
        ├── components/
        │   ├── menu/
        │   │   ├── ProductGrid.tsx               # [3.2] Giao diện lưới sản phẩm
        │   │   └── MenuStateView.tsx             # [3.3] Xử lý trạng thái UI (Loading / Empty / Error)
        │   ├── product-detail/
        │   │   ├── SizeSelector.tsx              # [4.2] Tùy chọn Size (S / M / L)
        │   │   └── ToppingSelector.tsx           # [4.2] Tùy chọn Topping
        │   └── cart/
        │       ├── CartItemRow.tsx               # [5.2] Thao tác giỏ hàng (Thêm / Sửa số lượng / Xóa)
        │       └── CartSummary.tsx               # [5.3] Tính tổng tiền & Badge số lượng (CartBadge)
        ├── utils/pricing.ts                      # [4.3] Logic tính giá động theo Size & Topping
        ├── store/useCartStore.ts                 # [5.1] Quản lý State giỏ hàng (Zustand + LocalStorage)
        └── app/
            ├── page.tsx                          # [3.2] Trang Menu (Frontend)
            ├── products/[id]/page.tsx            # [4.1] Trang chi tiết & tùy chọn sản phẩm
            └── cart/page.tsx                     # [5.2] Trang Giỏ hàng
```

---

## 🚀 Hướng dẫn cài đặt & Chạy dự án

### 1. Chuẩn bị biến môi trường
```bash
cp .env.example .env
```

### 2. Chạy đồng thời Backend và Frontend
```bash
npm run dev
```
- **Backend API (NestJS)**: `http://localhost:4000`
  - Kiểm tra Hello World: `GET http://localhost:4000/`
  - Danh sách sản phẩm: `GET http://localhost:4000/products`
  - Chi tiết sản phẩm: `GET http://localhost:4000/products/:id`
- **Frontend Web (Next.js)**: `http://localhost:3000`
  - Trang Menu: `http://localhost:3000/`
  - Trang Chi tiết & Chọn Size/Topping: `http://localhost:3000/products/p1`
  - Trang Giỏ hàng: `http://localhost:3000/cart`
