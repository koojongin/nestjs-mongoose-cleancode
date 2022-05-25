import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mSchema } from 'mongoose';

export type MarketDocument = Market & Document;
@Schema({
  id: false,
})
export class Market {
  /**
   * default ObjectId
   */
  @Prop({ auto: true })
  _id: mSchema.Types.ObjectId;

  /**
   * name
   */
  @Prop({ required: true, unique: true })
  name: string;

  /**
   * description
   */
  @Prop({ required: true })
  description: string;

  /**
   * 생성일시
   */
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  /**
   * 마켓 주인
   */
  @Prop({ required: true, ref: 'User' })
  owner: mSchema.Types.ObjectId;
}

export const MarketSchema = SchemaFactory.createForClass(Market);
MarketSchema.index({ createdAt: -1 });
