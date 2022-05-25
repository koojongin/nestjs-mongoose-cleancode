import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.modules';
import { MarketService } from '@/market/market.service';
import { MarketController } from '@/market/market.controller';
import { MarketRepository } from '@/market/market.repository';

@Module({
  imports: [DatabaseModule],
  providers: [MarketRepository, MarketService, MarketController],
  exports: [MarketRepository, MarketService],
})
export class MarketModule {}
