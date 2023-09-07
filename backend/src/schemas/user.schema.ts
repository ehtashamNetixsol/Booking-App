import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// export type Roles = 'user' | 'writer' | 'admin';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  username: string;
  @Prop({ unique: [true, 'User with this email is already here'] })
  email: string;
  @Prop()
  password: string;
  @Prop()
  profilePicture: string;
  @Prop({ enum: ['blocked', 'unblocked'], default: 'unblocked' })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
