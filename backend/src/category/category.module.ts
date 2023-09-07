import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { BlogSchema } from 'src/schemas/blog.schema';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AdminGuard } from 'src/middlewares/jwt.admin.guard';
import { WriterAdminGuard } from 'src/middlewares/jwt.writerAdmin.guard';
import { WriterGuard } from 'src/middlewares/jwt.writer.guard';
import { CategorySchema } from 'src/schemas/category.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, AdminGuard, WriterAdminGuard, WriterGuard],
})
export class CategoryModule {}
