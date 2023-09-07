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
import { BlogService } from './blog.service';
import { Blog } from 'src/schemas/blog.schema';
import { CreateBlogDto } from 'src/dto/create-blog.dto';
import { UpdateBlogDto } from 'src/dto/update-blog.dto';
import { AdminGuard } from 'src/middlewares/jwt.admin.guard';
import { WriterAdminGuard } from 'src/middlewares/jwt.writerAdmin.guard';
import { WriterGuard } from 'src/middlewares/jwt.writer.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'multer.config';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async GetAllBlogs(@Query('category') category: string): Promise<Blog[]> {
    if (category) {
      // Fetch blogs by category
      // console.log(category);
      return this.blogService.getBlogsByCategory(category);
    } else {
      // Fetch all blogs
      return this.blogService.getAll();
    }
  }
  @Get('admin')
  async GetAllBlogsAdmin(
    @Query('category') category: string,
    @Query('status') status: string,
  ): Promise<Blog[]> {
    if (category || status) {
      console.log(category);
      return this.blogService.getBlogsByFiltersAdmin(category, status);
    } else {
      // Fetch all blogs
      return this.blogService.getAllBlogsAdmin();
    }
  }
  @Patch(':id')
  async ApproveBlog(
    @Param('id') id: string,
  ): Promise<{ success?: boolean; message?: string }> {
    console.log(id);
    return this.blogService.approveBlog(id);
  }

  @Get('writer/:id')
  // @UseGuards(AuthGuard(), WriterGuard)
  async GetAllBlogsUser(
    @Param() id: string,
  ): Promise<{ blogs?: Blog[]; success?: boolean; message?: string }> {
    console.log('into get all blogs of user');
    return this.blogService.getAllBlogUser(id);
  }

  @Get(':id')
  // @UseGuards(AuthGuard())
  async GetBlog(@Param('id') id: string): Promise<{ blogFound: Blog }> {
    try {
      return this.blogService.getSingleBlog(id);
    } catch (error) {
      console.log(error.message);
    }
  }
  @Post('new')
  @UseGuards(AuthGuard(), WriterGuard)
  @UseInterceptors(FileInterceptor('thumbnail', multerConfig))
  async CreateBlog(
    @Req() req,
    @UploadedFile() thumbnail: Express.Multer.File,
    @Body() blog: CreateBlogDto,
  ): Promise<{ newBlog?: Blog; success?: boolean; message?: string }> {
    // getting filePath for the uploaded file
    const filePath = thumbnail.path.normalize();
    console.log(filePath);
    blog.thumbnail = filePath;
    // console.log(req.user, blog);
    return this.blogService.createBlog(blog, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), WriterAdminGuard)
  async RemoveBlog(@Param('id') id: string): Promise<string> {
    return await this.blogService.deleteBlog(id);
  }
  @Put(':id')
  @UseGuards(AuthGuard(), WriterGuard)
  @UseInterceptors(FileInterceptor('thumbnail', multerConfig))
  async UpadateBlog(
    @Param('id') id: string,
    @UploadedFile() thumbnail: Express.Multer.File,
    @Body() blog: UpdateBlogDto,
  ): Promise<{ success?: boolean; message?: string }> {
    if (!thumbnail) {
      console.log('No file chosen for thumbnail');
      // Proceed with the update without changing the thumbnail
    } else {
      console.log('File chosen for thumbnail');
      const filePath = thumbnail.path.normalize();
      console.log(filePath);
      // Update the thumbnail path in the blog object if needed
      blog.thumbnail = filePath;
    }
    // blog.thumbnail = filePath;
    return await this.blogService.updateBlog(id, blog);
  }
}
