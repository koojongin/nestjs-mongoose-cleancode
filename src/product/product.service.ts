import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ProductCreateRequestDto } from '@/product/dto/create-request.dto';
import { ProductRepository } from '@/product/product.repository';
import { MarketService } from '@/market/market.service';
import { ProductCategory, ProductRegion, ProductSort } from '@/product/product.schema';
import mongoose from 'mongoose';
import { ProductUpdateRequestDto } from '@/product/dto/update-request.dto';
import { UserDocument } from '@/user/user.schema';
import * as _ from 'lodash';
const { ObjectId } = mongoose.Types;

interface ProductListRequestQuery {
  name?: string;
  region?: ProductRegion;
  sort?: ProductSort;
  category?: ProductCategory;
}

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository, private readonly marketService: MarketService) {}

  async findOneById(id) {
    const isValid = ObjectId.isValid(id);
    if (!isValid) throw new BadRequestException();
    return this.productRepository.findOne({ _id: id });
  }
  async findAllWithFilter(requestQuery: ProductListRequestQuery) {
    // pagination 필요하지만 별도 구현하지 않음.
    const { name, region, sort, category } = requestQuery;
    const addRegionQuery = (query, region) => {
      if (!region) return query;
      return Object.assign({ region: { $in: [region] } }, query);
    };

    const addNameQuery = (query, name) => {
      if (!name) return query;
      return Object.assign({ name: { $regex: name, $options: 'i' } }, query);
    };

    const addCategoryQuery = (query, category) => {
      if (!category) return query;
      return Object.assign({ category }, query);
    };

    const addSortingFilter = (filter, sort = 'createdAt') => {
      if (sort == 'orderEndedAt') return Object.assign({ sort: 'orderEndedAt' }, filter);
      if (sort == 'createdAt') return Object.assign({ sort: 'createdAt' }, filter);
    };

    let query = {};
    query = addRegionQuery(query, region);
    query = addNameQuery(query, name);
    query = addCategoryQuery(query, category);

    let filter = {};
    filter = addSortingFilter(filter, sort);
    return this.productRepository.find(query, filter);
  }

  async create(user: UserDocument, productCreateRequestDto: ProductCreateRequestDto) {
    const market = await this.marketService.findOneByOwner(user);
    if (!market) throw new HttpException(`사용자 마켓 없음.`, HttpStatus.CONFLICT);

    const { name } = productCreateRequestDto;
    const productInMarket = await this.productRepository.findOne({
      name,
      market: market._id,
    });

    if (productInMarket) throw new HttpException(`마켓에 동일한 이름의 제품 존재.`, HttpStatus.CONFLICT);

    return this.productRepository.create({
      market: market._id,
      createdBy: user._id,
      ...productCreateRequestDto,
    });
  }

  async update(user: UserDocument, productUpdateRequestDto: ProductUpdateRequestDto) {
    const { _id: productId } = productUpdateRequestDto;
    const isValid = ObjectId.isValid(productId);
    if (!isValid) throw new BadRequestException();

    const foundProduct = await this.productRepository.findOne({ _id: productId, isDeleted: false });
    if (!foundProduct) throw new BadRequestException();

    const { createdBy: productOwnerId } = foundProduct;
    const { _id: requestUserId } = user;
    if (!_.isEmpty(productOwnerId) && productOwnerId.toString() != requestUserId.toString())
      throw new UnauthorizedException();

    Object.assign(foundProduct, productUpdateRequestDto);
    return foundProduct.save();
  }

  async delete(user: UserDocument, productId: string) {
    const isValid = ObjectId.isValid(productId);
    if (!isValid) throw new BadRequestException();

    const foundProduct = await this.productRepository.findOne({ _id: productId, isDeleted: false });
    if (!foundProduct) throw new BadRequestException();

    const { createdBy: productOwnerId } = foundProduct;
    const { _id: requestUserId } = user;
    if (!_.isEmpty(productOwnerId) && productOwnerId.toString() != requestUserId.toString())
      throw new UnauthorizedException();

    foundProduct.isDeleted = true;
    return foundProduct.save();
  }
}
