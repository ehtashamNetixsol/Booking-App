import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Eventt } from './event.schema';
import mongoose from 'mongoose';
import { IsOptional } from 'class-validator';
// import { Category } from './category.schema';

@Schema()
export class Booking {
  @Prop()
  @IsOptional()
  tickets: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Eventt' })
  event: Eventt;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
