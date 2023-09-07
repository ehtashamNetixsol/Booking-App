import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import mongoose, { Document } from 'mongoose';
import { Blog } from './blog.schema';

@Schema({
  timestamps: true,
})
export class Comment extends Document {
  @Prop({ required: true })
  commentText: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  authorId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' })
  blogId: Blog;

  @Prop()
  timestamp: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
