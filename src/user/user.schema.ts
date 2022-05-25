import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mSchema } from 'mongoose';

export type UserDocument = User & Document;
@Schema({
  id: false,
  toJSON: {
    virtuals: true,
    transform: (document: any, returnedObject: any) => {
      delete returnedObject.__v;
      delete returnedObject.password;
      return returnedObject;
    },
  },
})
export class User {
  /**
   * default ObjectId
   */
  @Prop({ auto: true })
  _id: mSchema.Types.ObjectId;

  /**
   * User Identifier
   */
  @Prop({ required: true, unique: true })
  identifier: string;

  /**
   * User password
   */
  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: false })
  isSeller: boolean;

  /**
   * User 생성일시
   */
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ createdAt: -1 });
