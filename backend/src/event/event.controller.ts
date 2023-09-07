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
import { EventService } from './event.service';
import { CreateEventDto } from 'src/dto/create-event.dto';
import { Eventt } from 'src/schemas/event.schema';
import { UpdateEventDto } from 'src/dto/update-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async GetAllEvnets(
    @Query('category') category: string,
    @Query('search') search: string,
  ): Promise<Eventt[]> {
    if (category) {
      // Fetch events by category
      return this.eventService.getEventsByCategory(category);
    } else if (search) {
      // Fetch events by search query
      return this.eventService.searchEvents(search);
    } else {
      // Fetch all events
      return this.eventService.getAll();
    }
  }


  // @Get('admin')
  // async GetAllBlogsAdmin(
  //   @Query('category') category: string,
  //   @Query('status') status: string,
  // ): Promise<Blog[]> {
  //   if (category || status) {
  //     console.log(category);
  //     return this.eventService.getBlogsByFiltersAdmin(category, status);
  //   } else {
  //     // Fetch all blogs
  //     return this.eventService.getAllBlogsAdmin();
  //   }
  // }

  @Get('user/:id')
  async GetAllEventsUser(
    @Param() id: string,
  ): Promise<{ events?: Eventt[]; success?: boolean; message?: string }> {
    console.log('into get all Events of user');
    return this.eventService.getAllEventsUser(id);
  }

  @Get(':id')
  async GetEvent(@Param('id') id: string): Promise<{ eventFound: Eventt }> {
    try {
      return this.eventService.getSingleEvent(id);
    } catch (error) {
      console.log(error.message);
    }
  }
  @Post('new')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('thumbnail', multerConfig))
  async CreateEvent(
    @Req() req,
    @UploadedFile() thumbnail: Express.Multer.File,
    @Body() event: CreateEventDto,
  ): Promise<{ newEvent?: Eventt; success?: boolean; message?: string }> {
    // getting filePath for the uploaded file
    if (thumbnail) {
      const filePath = thumbnail.path.normalize();
      console.log(filePath);
      event.thumbnail = filePath;
    }
    // console.log(req.user, blog);
    return this.eventService.createEvent(event, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async RemoveBlog(@Param('id') id: string): Promise<string> {
    return await this.eventService.deleteEvent(id);
  }
  @Put(':id')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('thumbnail', multerConfig))
  async UpadateBlog(
    @Param('id') id: string,
    @UploadedFile() thumbnail: Express.Multer.File,
    @Body() event: UpdateEventDto,
  ): Promise<{ success?: boolean; message?: string }> {
    if (!thumbnail) {
      console.log('No file chosen for thumbnail');
      // Proceed with the update without changing the thumbnail
    } else {
      console.log('File chosen for thumbnail');
      const filePath = thumbnail.path.normalize();
      console.log(filePath);
      // Update the thumbnail path in the blog object if needed
      event.thumbnail = filePath;
    }
    // blog.thumbnail = filePath;
    return await this.eventService.updateEvent(id, event);
  }
}
