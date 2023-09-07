import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { Blog } from 'src/schemas/blog.schema';
import { ConflictException } from '@nestjs/common';
import { Types } from 'mongoose';
import { Eventt } from 'src/schemas/event.schema';
import { CreateEventDto } from 'src/dto/create-event.dto';
import { UpdateEventDto } from 'src/dto/update-event.dto';
import { Booking } from 'src/schemas/Booking.Schema';
import { CreateBookingDto } from 'src/dto/create-booking.dto';
import { UpdateBookingDto } from 'src/dto/update-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private BookingModel: mongoose.Model<Booking>,
    @InjectModel(Eventt.name) private EventModel: mongoose.Model<Eventt>,
  ) {}

  async getAll(): Promise<Booking[]> {
    const bookings = await this.BookingModel.find()
      .populate('event')
      .populate('user');

    if (!bookings) {
      throw new NotFoundException('No Bookings found');
    }
    return bookings;
  }

  // async getSingleEvent(id: string): Promise<{ BookingFound: Eventt }> {
  //   // const objectId = new Types.ObjectId(id);
  //   const BookingFound = await this.BookingModel.findById(id).populate('user');
  //   // .populate('category');
  //   if (!BookingFound) {
  //     throw new NotFoundException('No Event found');
  //   }
  //   return { BookingFound };
  // }
  // async getBlogsByFiltersAdmin(
  //   category: string,
  //   status: string,
  // ): Promise<Blog[]> {
  //   let query: Record<string, any> = {};
  //   if (category) {
  //     query.category = category;
  //   }

  //   if (status) {
  //     query.status = status;
  //   }
  //   const blogs = await this.BookingModel.find(query)
  //     .populate('user')
  //     .populate('category');
  //   // console.log(blogs);
  //   return blogs;
  // }
  // async getAllBlogsAdmin(): Promise<Blog[]> {
  //   const blogs = await this.BookingModel.find()
  //     .populate('user')
  //     .populate('category');

  //   if (!blogs) {
  //     throw new NotFoundException('No Blogs found');
  //   }
  //   return blogs;
  // }
  async getAllBookingsUser(
    id: string,
  ): Promise<{ bookings?: Booking[]; success?: boolean; message?: string }> {
    const objectId = new Types.ObjectId(id);
    const bookings = await this.BookingModel.find({
      user: objectId,
    })
      .populate('event')
      .populate('user');

    if (!bookings) {
      return {
        success: false,
        message: `No bookings found`,
      };
      // throw new NotFoundException('No Blogs found');
    }
    return { bookings, success: true, message: 'bookings Fetched' };
  }

  async getEventAttendees(eventId: string): Promise<any> {
    try {
      const attendees = await this.BookingModel.find({
        event: eventId,
      }).populate('user', 'username');

      return {
        success: true,
        attendees,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error fetching attendees',
      };
    }
  }

  async getSingleBooking(id: string): Promise<{ bookingFound: Booking }> {
    const bookingFound = await this.BookingModel.findById(id)
      .populate('user')
      .populate('event');
    if (!bookingFound) {
      throw new NotFoundException('No Booking found');
    }
    return { bookingFound };
  }

  async createBooking(
    booking: CreateBookingDto,
    user: User,
  ): Promise<{ newBooking?: Booking; success?: boolean; message?: string }> {
    try {
      // console.log(booking);
      // Find the event associated with the booking
      const event = await this.EventModel.findById(booking.event);

      if (!event) {
        return {
          success: false,
          message: `Event with ID ${booking.event} not found.`,
        };
      }

      // Check if the event's user is the same as the booking user
      if (event.user.toString() === user._id.toString()) {
        return {
          success: false,
          message: `You cannot book your own event.`,
        };
      }

      // Check if a booking already exists for the user and event
      const existingBooking = await this.BookingModel.findOne({
        user: user._id,
        event: booking.event,
      });

      if (existingBooking) {
        return {
          success: false,
          message: `Booking already exists for this event.`,
        };
      }

      const data = Object.assign(booking, { user: user._id });
      const newBooking = await this.BookingModel.create(data);

      if (!newBooking) {
        return {
          success: false,
          message: `Error creating Booking`,
        };
      }

      return {
        newBooking,
        success: true,
        message: `Booking Created!`,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || `An error occurred while creating the booking.`,
      };
    }
  }

  async deleteBooking(id: string): Promise<string> {
    const booking = await this.BookingModel.findByIdAndDelete(id)
      .populate('user')
      .populate('event');

    if (!booking) {
      throw new NotFoundException('Error deleting Booking');
    }

    return `Booking by ${booking.user.username} for event ${booking.event.title} has been removed`;
  }

  async updateBooking(
    id: string,
    booking: UpdateBookingDto,
  ): Promise<{ success?: boolean; message?: string }> {
    // const objectId = new Types.ObjectId(id);
    console.log(booking, id);
    const editBooking = await this.BookingModel.findByIdAndUpdate(id, booking, {
      new: true,
      runValidators: true,
    }).populate('event');

    if (!editBooking) {
      return {
        success: false,
        message: 'Error updating Booking',
      };
      // throw new NotFoundException('Error updating blog');
    }

    return {
      success: true,
      message: `Booking for event ${editBooking.event.title} has been edited`,
    };
  }
}
