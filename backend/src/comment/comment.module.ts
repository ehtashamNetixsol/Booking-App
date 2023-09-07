import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { BlogSchema } from 'src/schemas/blog.schema';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { AdminGuard } from 'src/middlewares/jwt.admin.guard';
import { WriterAdminGuard } from 'src/middlewares/jwt.writerAdmin.guard';
import { WriterGuard } from 'src/middlewares/jwt.writer.guard';
import { CategorySchema } from 'src/schemas/category.schema';
import { CommentSchema } from 'src/schemas/comment.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Blog', schema: BlogSchema },
      { name: 'Comment', schema: CommentSchema },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService, AdminGuard, WriterAdminGuard, WriterGuard],
})
export class CommentModule {}
