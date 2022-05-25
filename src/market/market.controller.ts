import { Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MarketService } from '@/market/market.service';

@ApiTags('Market')
@Controller({
  path: 'market',
})
@UsePipes(new ValidationPipe())
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @ApiOperation({
    summary: '',
    description: '',
  })
  @Post('')
  async empty() {}
}
