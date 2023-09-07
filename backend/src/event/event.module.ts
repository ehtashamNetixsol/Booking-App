import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { BlogSchema } from 'src/schemas/blog.schema';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { AdminGuard } from 'src/middlewares/jwt.admin.guard';
import { WriterAdminGuard } from 'src/middlewares/jwt.writerAdmin.guard';
import { WriterGuard } from 'src/middlewares/jwt.writer.guard';
import { CategorySchema } from 'src/schemas/category.schema';
import { EventtSchema } from 'src/schemas/event.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Eventt', schema: EventtSchema },
      { name: 'Category', schema: CategorySchema },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService, AdminGuard, WriterAdminGuard, WriterGuard],
})
export class EventModule {}
