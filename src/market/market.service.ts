import { Injectable } from '@nestjs/common';
import { MarketRepository } from '@/market/market.repository';

@Injectable()
export class MarketService {
  constructor(private readonly marketRepository: MarketRepository) {}

  async findOneByOwner(owner) {
    return this.marketRepository.findOne({ owner });
  }
}
