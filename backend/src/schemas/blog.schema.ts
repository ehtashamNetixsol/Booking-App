import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import mongoose from 'mongoose';
import { Category } from './category.schema';

@Schema({
  timestamps: true,
})
export class Blog {
  @Prop()
  title: string;
  @Prop()
  thumbnail: string;
  @Prop()
  description: string;
  @Prop({ enum: ['approved', 'unapproved'], default: 'unapproved' })
  status: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: Category;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
