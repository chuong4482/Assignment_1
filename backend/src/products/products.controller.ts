import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductEntity } from './entities/product.entity';
import { ProductsService } from './products.service';

/**
 * [2.2] API Endpoint GET /products và GET /products/:id
 */
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ): Promise<ProductEntity[]> {
    return this.productsService.findAll(category, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductEntity> {
    return this.productsService.findOne(id);
  }
}
