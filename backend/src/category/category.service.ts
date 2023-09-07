import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { Blog } from 'src/schemas/blog.schema';
import { ConflictException } from '@nestjs/common';
import { Types } from 'mongoose';
import { Category } from 'src/schemas/category.schema';
import { CreateCategoryDto } from 'src/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private CategoryModel: mongoose.Model<Category>,
  ) {}

  async getAll(): Promise<Category[]> {
    const categories = await this.CategoryModel.find();

    if (!categories) {
      throw new NotFoundException('No Categories found');
    }
    return categories;
  }
  // async getAllBlogUser(
  //   id: string,
  // ): Promise<{ blogs: Blog[]; success: boolean }> {
  //   const objectId = new Types.ObjectId(id);
  //   const blogs = await this.CategoryModel.find({ user: objectId });

  //   if (!blogs) {
  //     throw new NotFoundException('No Blogs found');
  //   }
  //   return { blogs, success: true };
  // }

  async getSingleCategory(id: string): Promise<Category> {
    const CategoryFound = await this.CategoryModel.findById(id);
    if (!CategoryFound) {
      throw new NotFoundException('No Category found');
    }
    return CategoryFound;
  }

  async createCategory(
    category: CreateCategoryDto,
    user: User,
  ): Promise<{ newCategory?: Category; success?: boolean; message?: string }> {
    // console.log(blog);
    const { title } = category;
    // console.log(blog);

    const CategoryFound = await this.CategoryModel.findOne({ title });

    if (CategoryFound) {
      return {
        success: false,
        message: `Category with title ${title}  already exists.`,
      };
      // throw new ConflictException(`Blog with title ${title}  already exists.`);
    }

    // const data = Object.assign(category);
    // console.log(data);

    const newCategory = await this.CategoryModel.create(category);

    if (!newCategory) {
      return {
        success: false,
        message: `Error creating Category`,
      };
      // throw new NotFoundException('Error creating Blog');
    }

    return {
      newCategory,
      success: true,
      message: `Category Created`,
    };
  }
  async deleteCategory(id: string): Promise<string> {
    const Category = await this.CategoryModel.findByIdAndDelete(id);

    if (!Category) {
      throw new NotFoundException('Error creating Category');
    }

    return `Category by ${Category.title} has been deleted`;
  }

  async updateCategory(
    id: string,
    category: UpdateCategoryDto,
  ): Promise<string> {
    const editCategory = await this.CategoryModel.findByIdAndUpdate(
      id,
      category,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!editCategory) {
      throw new NotFoundException('Error updating Category');
    }

    return `Category has been updated`;
  }
}
