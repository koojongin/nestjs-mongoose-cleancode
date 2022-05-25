import { Injectable } from '@nestjs/common';
import { Market, MarketDocument } from '@/market/market.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';

@Injectable()
export class MarketRepository {
  constructor(@InjectModel(Market.name) private marketModel: Model<Market>) {}

  async create(query): Promise<MarketDocument> {
    const document = await this.marketModel.create(query);
    return document;
  }

  async find(query, opts?: QueryOptions): Promise<MarketDocument[]> {
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

  async findOne(query, opts?: QueryOptions): Promise<MarketDocument> {
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
