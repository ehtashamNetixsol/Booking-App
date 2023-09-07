import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { Blog } from 'src/schemas/blog.schema';
import { ConflictException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private BlogModel: mongoose.Model<Blog>,
  ) {}

  async getBlogsByCategory(category: string): Promise<Blog[]> {
    const blogs = await this.BlogModel.find({ category, status: 'approved' })
      .populate('user')
      .populate('category');
    // console.log(blogs);
    return blogs;
  }
  async getAll(): Promise<Blog[]> {
    const blogs = await this.BlogModel.find({ status: 'approved' })
      .populate('user')
      .populate('category');

    if (!blogs) {
      throw new NotFoundException('No Blogs found');
    }
    return blogs;
  }
  async getBlogsByFiltersAdmin(
    category: string,
    status: string,
  ): Promise<Blog[]> {
    let query: Record<string, any> = {};
    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }
    const blogs = await this.BlogModel.find(query)
      .populate('user')
      .populate('category');
    // console.log(blogs);
    return blogs;
  }
  async getAllBlogsAdmin(): Promise<Blog[]> {
    const blogs = await this.BlogModel.find()
      .populate('user')
      .populate('category');

    if (!blogs) {
      throw new NotFoundException('No Blogs found');
    }
    return blogs;
  }
  async getAllBlogUser(
    id: string,
  ): Promise<{ blogs?: Blog[]; success?: boolean; message?: string }> {
    const objectId = new Types.ObjectId(id);
    const blogs = await this.BlogModel.find({
      user: objectId,
      status: 'approved',
    })
      .populate('category')
      .populate('user');

    if (!blogs) {
      return {
        success: false,
        message: `No Blogs found`,
      };
      // throw new NotFoundException('No Blogs found');
    }
    return { blogs, success: true, message: 'Blogs Fetched' };
  }

  async getSingleBlog(id: string): Promise<{ blogFound: Blog }> {
    const blogFound = await this.BlogModel.findById(id)
      .populate('user')
      .populate('category');
    if (!blogFound) {
      throw new NotFoundException('No Blog found');
    }
    return { blogFound };
  }
  async approveBlog(
    id: string,
  ): Promise<{ success?: boolean; message?: string }> {
    const blogFound = await this.BlogModel.findById(id);
    if (!blogFound) {
      return {
        success: false,
        message: 'no blog found',
      };
      // throw new NotFoundException('No Blog found');
    }

    blogFound.status = 'approved';
    await blogFound.save();

    return { success: true, message: 'Blog Approved' };
  }

  async createBlog(
    blog: Blog,
    user: User,
  ): Promise<{ newBlog?: Blog; success?: boolean; message?: string }> {
    // console.log(blog);
    const { title } = blog;
    // console.log(blog);

    const blogFound = await this.BlogModel.findOne({ title });

    if (blogFound) {
      return {
        success: false,
        message: `Blog with title ${title}  already exists.`,
      };
      // throw new ConflictException(`Blog with title ${title}  already exists.`);
    }

    const data = Object.assign(blog, { user: user._id });
    // console.log(data);

    const newBlog = await this.BlogModel.create(data);

    if (!newBlog) {
      return {
        success: false,
        message: `Error creating Blog`,
      };
      // throw new NotFoundException('Error creating Blog');
    }

    return {
      newBlog,
      success: true,
      message: `Blog requested, If Admin approves it will show on writer dashboard`,
    };
  }
  async deleteBlog(id: string): Promise<string> {
    const blog = await this.BlogModel.findByIdAndDelete(id);

    if (!blog) {
      throw new NotFoundException('Error creating Blog');
    }

    return `Blog by ${blog.title} has been deleted`;
  }

  async updateBlog(
    id: string,
    book: Blog,
  ): Promise<{ success?: boolean; message?: string }> {
    const editBlog = await this.BlogModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true,
    });

    if (!editBlog) {
      return {
        success: false,
        message: 'Error updating Blog',
      };
      // throw new NotFoundException('Error updating blog');
    }

    return {
      success: true,
      message: `Blog by ${editBlog.title} has been edited`,
    };
  }
}
