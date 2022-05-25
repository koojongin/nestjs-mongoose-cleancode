import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { Product, ProductDocument } from '@/product/product.schema';

@Injectable()
export class ProductRepository {
  constructor(@InjectModel(Product.name) private marketModel: Model<Product>) {}

  async create(query): Promise<ProductDocument> {
    const document = await this.marketModel.create(query);
    return document;
  }

  async find(_query = {}, opts?: QueryOptions): Promise<ProductDocument[]> {
    const query = Object.assign({ isDeleted: false }, _query);
    const options: QueryOptions = Object.assign(
      {
        sort: { createdAt: -1 },
        limit: 100,
        projection: {},
      },
      opts
    );
    const cursor = this.marketModel.find(query, options?.projection, options);
    if (options?.skip) {
      cursor.skip(options.skip);
    }
    cursor.limit(options.limit);

    if (options?.lean == true) {
      cursor.lean();
    }

    const documents = await cursor.exec();
    return documents;
  }

  async findOne(_query, opts?: QueryOptions): Promise<ProductDocument> {
    const query = Object.assign({ isDeleted: false }, _query);
    const options: QueryOptions = Object.assign(
      {
        sort: { createdAt: -1 },
        limit: 100,
        projection: {},
      },
      opts
    );
    const cursor = this.marketModel.findOne(query, options?.projection, options);

    if (options?.skip) {
      cursor.skip(options.skip);
    }
    cursor.limit(options.limit);

    if (options?.lean == true) {
      cursor.lean();
    }

    return cursor.exec();
  }
}
