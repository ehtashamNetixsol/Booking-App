import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { BlogSchema } from 'src/schemas/blog.schema';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { AdminGuard } from 'src/middlewares/jwt.admin.guard';
import { WriterAdminGuard } from 'src/middlewares/jwt.writerAdmin.guard';
import { WriterGuard } from 'src/middlewares/jwt.writer.guard';
import { CategorySchema } from 'src/schemas/category.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Blog', schema: BlogSchema },
      { name: 'Category', schema: CategorySchema },
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService, AdminGuard, WriterAdminGuard, WriterGuard],
})
export class BlogModule {}
