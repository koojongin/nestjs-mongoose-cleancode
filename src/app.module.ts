import { Module } from '@nestjs/common';
import { UserModule } from '@/src/user/user.module';
import { DatabaseModule } from '@/database/database.modules';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { UserController } from '@/src/user/user.controller';
import { CryptoModule } from '@/crypto/crypto.module';
import { AuthModule } from '@/auth/auth.module';
import { MarketModule } from '@/market/market.module';
import { ProductModule } from '@/product/product.module';
import { ProductController } from '@/product/product.controller';
import { MarketController } from '@/market/market.controller';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpResponseInterceptor } from '@/common/interceptors/http-response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        MONGODB_URL: Joi.string().required(),
        LOG_LEVEL: Joi.string().required(),
      }),
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          transports: [
            new winston.transports.Console({
              level: configService.get<string>('LOG_LEVEL'),
              format: winston.format.combine(
                winston.format.timestamp(),
                utilities.format.nestLike('test', { prettyPrint: true })
              ),
            }),
          ],
        };
      },
    }),
    AuthModule,
    DatabaseModule,
    UserModule,
    CryptoModule,
    MarketModule,
    ProductModule,
  ],
  controllers: [UserController, ProductController, MarketController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpResponseInterceptor,
    },
  ],
  exports: [WinstonModule],
})
export class AppModule {}
