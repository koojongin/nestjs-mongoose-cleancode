import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '@/src/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(query): Promise<UserDocument> {
    const document = await this.userModel.create(query);
    return document;
  }

  async find(query, opts?: QueryOptions): Promise<UserDocument[]> {
    const options: QueryOptions = Object.assign(
      {
        sort: { createdAt: -1 },
        limit: 100,
        projection: {},
      },
      opts
    );
    const cursor = this.userModel.find(query, options?.projection, options);

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

  async findOne(query, opts?: QueryOptions): Promise<UserDocument> {
    const options: QueryOptions = Object.assign(
      {
        sort: { createdAt: -1 },
        limit: 100,
        projection: {},
      },
      opts
    );
    const cursor = this.userModel.findOne(query, options?.projection, options);

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
