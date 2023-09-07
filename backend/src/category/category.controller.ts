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
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoryService } from './category.service';
import { Blog } from 'src/schemas/blog.schema';
import { CreateBlogDto } from 'src/dto/create-blog.dto';
import { UpdateBlogDto } from 'src/dto/update-blog.dto';
import { AdminGuard } from 'src/middlewares/jwt.admin.guard';
import { WriterAdminGuard } from 'src/middlewares/jwt.writerAdmin.guard';
import { WriterGuard } from 'src/middlewares/jwt.writer.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'multer.config';
import { CreateCategoryDto } from 'src/dto/create-category.dto';
import { Category } from 'src/schemas/category.schema';
import { UpdateCategoryDto } from 'src/dto/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async GetAllBlogs(): Promise<Category[]> {
    return this.categoryService.getAll();
  }
  // @Get('/:id')
  // async GetAllBlogsUser(@Param() id: string): Promise<{ blogs: Blog[] }> {
  //   console.log('into get all blogs of user');
  //   return this.categoryService.getAllBlogUser(id);
  // }
  @Get(':id')
  @UseGuards(AuthGuard())
  async GetCategory(@Param('id') id: string): Promise<Category> {
    try {
      return this.categoryService.getSingleCategory(id);
    } catch (error) {
      console.log(error.message);
    }
  }
  @Post('new')
  @UseGuards(AuthGuard())
  async CreateCategory(
    @Req() req,
    @Body() category: CreateCategoryDto,
  ): Promise<{ newCategory?: Category; success?: boolean; message?: string }> {
    // console.log(req.user, blog);
    return this.categoryService.createCategory(category, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), AdminGuard)
  async RemoveCategory(@Param('id') id: string): Promise<string> {
    return await this.categoryService.deleteCategory(id);
  }
  @Put(':id')
  @UseGuards(AuthGuard(), AdminGuard)
  async UpadateBlog(
    @Param('id') id: string,
    @Body() category: UpdateCategoryDto,
  ): Promise<string> {
    return await this.categoryService.updateCategory(id, category);
  }
}
