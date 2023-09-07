import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { BlogSchema } from 'src/schemas/blog.schema';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { AdminGuard } from 'src/middlewares/jwt.admin.guard';
import { WriterAdminGuard } from 'src/middlewares/jwt.writerAdmin.guard';
import { WriterGuard } from 'src/middlewares/jwt.writer.guard';
import { CategorySchema } from 'src/schemas/category.schema';
import { BookingSchema } from 'src/schemas/Booking.Schema';
import { EventtSchema } from 'src/schemas/event.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Booking', schema: BookingSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'Eventt', schema: EventtSchema },
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService, AdminGuard, WriterAdminGuard, WriterGuard],
})
export class BookingModule {}
