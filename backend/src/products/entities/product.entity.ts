/**
 * [2.1] Thiết kế Model / Entity sản phẩm
 */
export class ProductEntity {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  stock: number;
  active: boolean;
  createdAt?: Date | string;

  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
  }
}
