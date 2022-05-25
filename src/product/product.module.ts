import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.modules';
import { ProductRepository } from '@/product/product.repository';
import { ProductService } from '@/product/product.service';
import { ProductController } from '@/product/product.controller';
import { MarketModule } from '@/market/market.module';

@Module({
  imports: [DatabaseModule, MarketModule],
  providers: [ProductRepository, ProductService, ProductController],
  exports: [ProductRepository, ProductService],
})
export class ProductModule {}
