import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Delete,
  Req,
  Put,
  Query,
  Patch,
  UseGuards,
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
import { BookingService } from './booking.service';
import { CreateEventDto } from 'src/dto/create-event.dto';
import { Eventt } from 'src/schemas/event.schema';
import { UpdateEventDto } from 'src/dto/update-event.dto';
import { CreateBookingDto } from 'src/dto/create-booking.dto';
import { Booking } from 'src/schemas/Booking.Schema';
import { UpdateBookingDto } from 'src/dto/update-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // @Get()
  // async GetAllEvnets(@Query('category') category: string): Promise<Eventt[]> {
  //   if (category) {
  //     // Fetch blogs by category
  //     // console.log(category);
  //     return this.bookingService.getEventsByCategory(category);
  //   } else {
  //     // Fetch all blogs
  //     return this.bookingService.getAll();
  //   }
  // }

  @Get()
  async GetAllBookings(): Promise<Booking[]> {
    return this.bookingService.getAll();
  }
  @Get(':id')
  async GetAllBookingsUser(
    @Param('id') id: string,
  ): Promise<{ bookings?: Booking[]; success?: boolean; message?: string }> {
    return this.bookingService.getAllBookingsUser(id);
  }
  

  // @Get('admin')
  // async GetAllBlogsAdmin(
  //   @Query('category') category: string,
  //   @Query('status') status: string,
  // ): Promise<Blog[]> {
  //   if (category || status) {
  //     console.log(category);
  //     return this.bookingService.getBlogsByFiltersAdmin(category, status);
  //   } else {
  //     // Fetch all blogs
  //     return this.bookingService.getAllBlogsAdmin();
  //   }
  // }

  // @Get('writer/:id')
  // async GetAllBlogsUser(
  //   @Param() id: string,
  // ): Promise<{ blogs?: Blog[]; success?: boolean; message?: string }> {
  //   console.log('into get all blogs of user');
  //   return this.bookingService.getAllBlogUser(id);
  // }

  @Get(':id')
  async GetBooking(
    @Param('id') id: string,
  ): Promise<{ bookingFound: Booking }> {
    try {
      return this.bookingService.getSingleBooking(id);
    } catch (error) {
      console.log(error.message);
    }
  }

  @Get(':id/attendees')
  async getEventAttendees(@Param('id') id: string): Promise<any> {
    return this.bookingService.getEventAttendees(id);
  }

  @Post('new')
  @UseGuards(AuthGuard())
  async CreateBooking(
    @Req() req,
    @Body() event: CreateBookingDto,
  ): Promise<{ newBooking?: Booking; success?: boolean; message?: string }> {
    // console.log(req.user, blog);
    return this.bookingService.createBooking(event, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async RemoveBooking(@Param('id') id: string): Promise<string> {
    return await this.bookingService.deleteBooking(id);
  }
  @Put(':id')
  @UseGuards(AuthGuard())
  async UpadateBooking(
    @Param('id') id: string,
    @Body() booking: UpdateBookingDto,
  ): Promise<{ success?: boolean; message?: string }> {
    return await this.bookingService.updateBooking(id, booking);
  }
}
