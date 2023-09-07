import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Delete,
  Req,
  UploadedFile,
  Put,
  Query,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Blog } from 'src/schemas/blog.schema';
import { CreateBlogDto } from 'src/dto/create-blog.dto';
import { UpdateBlogDto } from 'src/dto/update-blog.dto';
import { AdminGuard } from 'src/middlewares/jwt.admin.guard';
import { WriterAdminGuard } from 'src/middlewares/jwt.writerAdmin.guard';
import { WriterGuard } from 'src/middlewares/jwt.writer.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'multer.config';
import { CommentService } from './comment.service';
import { Comment } from 'src/schemas/comment.schema';
import { CreateCommentDto } from 'src/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/dto/update-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('new')
  @UseGuards(AuthGuard())
  async create(
    @Req() req,
    @Body() dto: CreateCommentDto,
  ): Promise<{
    createdComment?: Comment;
    message: string;
    success?: boolean;
  }> {
    // console.log(req.user);
    return this.commentService.createComment(dto, req.user);
  }

  @Get()
  async getCommentsByBlogId(
    @Query('comment') blogId: string,
  ): Promise<Comment[]> {
    return this.commentService.getCommentsByBlogId(blogId);
  }
  @Get('/mycomments/:id')
  async getMyComments(@Param('id') id: string): Promise<Comment[]> {
    // console.log(id);
    return this.commentService.getMyComments(id);
  }

  @Get()
  async findAll(): Promise<{
    posts?: Comment[];
    message: string;
    success: boolean;
  }> {
    return this.commentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<{
    post?: Comment;
    message: string;
    success: boolean;
  }> {
    console.log(id, 'findOneComment');
    return this.commentService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
  ): Promise<{
    updatedComment?: Comment;
    message: string;
    success: boolean;
  }> {
    // console.log(id)
    return this.commentService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async remove(@Param('id') id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.commentService.remove(id);
  }
}
