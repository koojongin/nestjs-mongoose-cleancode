import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from '@/src/user/user.schema';
import { Market, MarketSchema } from '@/market/market.schema';
import { Product, ProductSchema } from '@/product/product.schema';

const DATABASE_NAME = 'test';
/**
 * 데이터베이스 모듈
 */
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
      connectionName: DATABASE_NAME,
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Market.name, schema: MarketSchema },
        { name: Product.name, schema: ProductSchema },
      ],
      DATABASE_NAME
    ),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {
  constructor() {}
}
