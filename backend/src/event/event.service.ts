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

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Eventt.name) private EventModel: mongoose.Model<Eventt>,
  ) {}

  async searchEvents(search: string): Promise<Eventt[]> {
    const events = await this.EventModel.find({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    }).populate({
      path: 'user',
      // match: { username: { $regex: search, $options: 'i' } },
    });

    // const filteredEvents = events.filter((event) => event.user !== null);

    // return filteredEvents;
    return events;
  }

  async getEventsByCategory(category: string): Promise<Eventt[]> {
    const events = await this.EventModel.find({ category }).populate('user');
    // .populate('category');
    // console.log(blogs);
    return events;
  }
  async getAll(): Promise<Eventt[]> {
    const events = await this.EventModel.find().populate('user');
    // .populate('category');

    if (!events) {
      throw new NotFoundException('No Events found');
    }
    return events;
  }

  async getAllEventsUser(
    id: string,
  ): Promise<{ events?: Eventt[]; success?: boolean; message?: string }> {
    const objectId = new Types.ObjectId(id);
    const events = await this.EventModel.find({
      user: objectId,
    }).populate('user');

    if (!events) {
      return {
        success: false,
        message: `No Events found`,
      };
      // throw new NotFoundException('No Blogs found');
    }
    return { events, success: true, message: 'Events Fetched' };
  }

  async getSingleEvent(id: string): Promise<{ eventFound: Eventt }> {
    // const objectId = new Types.ObjectId(id);
    const eventFound = await this.EventModel.findById(id).populate('user');
    // .populate('category');
    if (!eventFound) {
      throw new NotFoundException('No Event found');
    }
    return { eventFound };
  }
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
  //   const blogs = await this.EventModel.find(query)
  //     .populate('user')
  //     .populate('category');
  //   // console.log(blogs);
  //   return blogs;
  // }
  // async getAllBlogsAdmin(): Promise<Blog[]> {
  //   const blogs = await this.EventModel.find()
  //     .populate('user')
  //     .populate('category');

  //   if (!blogs) {
  //     throw new NotFoundException('No Blogs found');
  //   }
  //   return blogs;
  // }
  // async getAllBlogUser(
  //   id: string,
  // ): Promise<{ blogs?: Blog[]; success?: boolean; message?: string }> {
  //   const objectId = new Types.ObjectId(id);
  //   const blogs = await this.EventModel.find({
  //     user: objectId,
  //     status: 'approved',
  //   })
  //     .populate('category')
  //     .populate('user');

  //   if (!blogs) {
  //     return {
  //       success: false,
  //       message: `No Blogs found`,
  //     };
  //     // throw new NotFoundException('No Blogs found');
  //   }
  //   return { blogs, success: true, message: 'Blogs Fetched' };
  // }

  // async getSingleBlog(id: string): Promise<{ eventFound: Blog }> {
  //   const eventFound = await this.EventModel.findById(id)
  //     .populate('user')
  //     .populate('category');
  //   if (!eventFound) {
  //     throw new NotFoundException('No Blog found');
  //   }
  //   return { eventFound };
  // }

  async createEvent(
    event: CreateEventDto,
    user: User,
  ): Promise<{ newEvent?: Eventt; success?: boolean; message?: string }> {
    // console.log(blog);
    const { title } = event;
    // console.log(blog);

    const eventFound = await this.EventModel.findOne({ title });

    if (eventFound) {
      return {
        success: false,
        message: `Event with title ${title}  already exists.`,
      };
      // throw new ConflictException(`Event with title ${title}  already exists.`);
    }

    const data = Object.assign(event, { user: user._id });
    // console.log(data);

    const newEvent = await this.EventModel.create(data);

    if (!newEvent) {
      return {
        success: false,
        message: `Error creating Event`,
      };
      // throw new NotFoundException('Error creating Blog');
    }

    return {
      newEvent,
      success: true,
      message: `Event Created!`,
    };
  }
  async deleteEvent(id: string): Promise<string> {
    const event = await this.EventModel.findByIdAndDelete(id);

    if (!event) {
      throw new NotFoundException('Error creating event');
    }

    return `event by ${event.title} has been deleted`;
  }

  async updateEvent(
    id: string,
    event: UpdateEventDto,
  ): Promise<{ success?: boolean; message?: string }> {
    const editEvent = await this.EventModel.findByIdAndUpdate(id, event, {
      new: true,
      runValidators: true,
    });

    if (!editEvent) {
      return {
        success: false,
        message: 'Error updating Event',
      };
      // throw new NotFoundException('Error updating blog');
    }

    return {
      success: true,
      message: `Event by ${editEvent.title} has been edited`,
    };
  }
}
