import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/auth/auth.guard';
import { RequestUser } from '@/common/decorator/request-user';
import { UserDocument } from '@/user/user.schema';
import { ProductCreateRequestDto } from '@/product/dto/create-request.dto';
import { ProductService } from '@/product/product.service';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ProductCategory, ProductRegion, ProductSort } from '@/product/product.schema';
import { ProductUpdateRequestDto } from '@/product/dto/update-request.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@ApiTags('Product')
@Controller({
  path: 'product',
})
@UsePipes(new ValidationPipe())
export class ProductController {
  constructor(
    private readonly productService: ProductService // @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  @Get('test')
  test() {
    return 'ok';
  }
  @ApiOperation({
    summary: '상품 목록 조회',
    description: '상품 목록 조회',
  })
  @ApiImplicitQuery({
    name: 'name',
    required: false,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'region',
    required: false,
    type: String,
    enum: ProductRegion,
  })
  @ApiImplicitQuery({
    name: 'category',
    required: false,
    type: String,
    enum: ProductCategory,
  })
  @ApiImplicitQuery({
    name: 'sort',
    required: false,
    type: String,
    enum: ProductSort,
  })
  @Get('list')
  async getProducts(
    @Query('name') name?: string,
    @Query('region') region?: ProductRegion,
    @Query('sort') sort?: ProductSort,
    @Query('category') category?: ProductCategory
  ) {
    return this.productService.findAllWithFilter({ name, region, sort, category });
  }

  @ApiOperation({
    summary: '상품 상세 조회',
    description: 'id로 상품을 조회',
  })
  @Get(':id')
  async getProduct(@Param('id') productId: string) {
    return this.productService.findOneById(productId);
  }

  @ApiOperation({
    summary: '상품 생성',
    description: '상품 생성 설명',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async createProduct(
    @RequestUser() requestUser: UserDocument,
    @Body() productCreateRequestDto: ProductCreateRequestDto
  ) {
    const product = await this.productService.create(requestUser, productCreateRequestDto);
    // this.logger.debug(`상품 생성: ${JSON.stringify(product)}`);
    return product;
  }

  @ApiOperation({
    summary: '상품 수정',
    description: '상품 수정 설명',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put()
  async updateProduct(
    @RequestUser() requestUser: UserDocument,
    @Body() productUpdateRequestDto: ProductUpdateRequestDto
  ) {
    return this.productService.update(requestUser, productUpdateRequestDto);
  }

  @ApiOperation({
    summary: '상품 삭제',
    description: '상품 삭제 설명',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteProduct(@RequestUser() requestUser: UserDocument, @Param('id') productId: string) {
    return this.productService.delete(requestUser, productId);
  }
}
