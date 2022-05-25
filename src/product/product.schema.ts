import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mSchema } from 'mongoose';

export enum ProductCategory {
  'PASSION' = 'PASSION',
  'FOOD' = 'FOOD',
}

export enum ProductRegion {
  'KOREA' = 'KOREA',
  'JAPAN' = 'JAPAN',
}

export enum ProductSort {
  createdAt = 'createdAt',
  orderEndedAt = 'orderEndedAt',
}

export type ProductDocument = Product & Document;
@Schema({
  id: false,
  toJSON: {
    virtuals: true,
    transform: (document: any, returnedObject: any) => {
      delete returnedObject.__v;
      delete returnedObject.isDeleted;
      return returnedObject;
    },
  },
})
export class Product {
  /**
   * default ObjectId
   */
  @Prop({ auto: true })
  _id: mSchema.Types.ObjectId;

  /**
   * 생성일시
   */
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  /**
   * 카테고리
   */
  @Prop({
    required: true,
    type: String,
    enum: ProductCategory,
  })
  category: string;

  @Prop({
    required: true,
  })
  name: string;

  /**
   * region
   */
  @Prop({
    required: true,
    type: String,
    enum: ProductRegion,
  })
  region: string;

  /**
   * 생성일시
   */
  @Prop({
    type: Date,
    required: true,
    default: () => {
      const now = new Date();
      const A_WEEK_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 7;
      return new Date(now.getTime() + A_WEEK_IN_MILLISECONDS);
    },
  })
  orderEndedAt: Date;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
  })
  price: number;

  @Prop({ required: true, ref: 'Market' })
  market: mSchema.Types.ObjectId;

  @Prop({ required: true, ref: 'User' })
  createdBy: mSchema.Types.ObjectId;

  @Prop({ required: true, default: false })
  isDeleted: boolean;

  @Prop({ required: false, type: Date })
  deletedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ market: 1, name: 1 }, { unique: true });
