import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { Types } from 'mongoose';
import { Comment } from 'src/schemas/comment.schema';
import { CreateCommentDto } from 'src/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: mongoose.Model<Comment>,
  ) {}

  async getCommentsByBlogId(blogId: string): Promise<Comment[]> {
    // console.log(blogId);
    // const challenge = blogId;
    const query = blogId ? { blogId: blogId } : {};

    const comments = await this.commentModel
      .find(query)
      .populate('authorId')
      .exec();
    // .populate('user');
    // if (!comments) {
    //   return;
    // }
    // console.log(comments);
    return comments;
  }
  async getMyComments(id: string): Promise<Comment[]> {
    // console.log(id);

    // const objectId = new mongoose.Types.ObjectId(id);

    const comments = await this.commentModel
      .find({ authorId: id })
      .populate('blogId')
      .populate('authorId');

    // console.log(comments);
    return comments;
  }

  async createComment(
    dto: CreateCommentDto,
    user: User,
  ): Promise<{
    createdComment?: Comment;
    message: string;
    success: boolean;
  }> {
    const data = Object.assign(dto, { authorId: user._id });

    const createdComment = await this.commentModel.create(data);
    if (!createdComment) {
      return {
        success: false,
        message: 'Error creating Comment',
      };
    }
    return {
      success: true,
      message: 'Comment posted',
      createdComment,
    };
  }

  async findAll(): Promise<{
    comments?: Comment[];
    message: string;
    success: boolean;
  }> {
    const comments = await this.commentModel.find().exec();

    if (!comments) {
      return {
        success: false,
        message: 'No Comments Found',
      };
    }
    return {
      success: true,
      message: 'comments fetched',
      comments,
    };
  }

  async findOne(id: string): Promise<{
    comment?: Comment;
    message: string;
    success: boolean;
  }> {
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      return {
        success: false,
        message: 'Comment not found',
      };
    }
    return {
      success: true,
      message: 'Comment fetched',
      comment,
    };
  }

  async update(
    id: string,
    dto: UpdateCommentDto,
  ): Promise<{
    updatedcomment?: Comment;
    message: string;
    success: boolean;
  }> {
    const updatedcomment = await this.commentModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updatedcomment) {
      return {
        success: false,
        message: 'comment not found',
      };
    }
    // console.log(updatedcomment)
    return {
      success: true,
      message: 'comment updated',
      updatedcomment,
    };
  }

  async remove(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const deletedcomment = await this.commentModel.findByIdAndDelete(id).exec();
    if (!deletedcomment) {
      return {
        success: false,
        message: 'comment not found',
      };
    }
    return {
      success: true,
      message: 'comment deleted',
    };
  }
}
