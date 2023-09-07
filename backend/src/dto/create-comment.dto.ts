import { IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  commentText: string;

  @IsNotEmpty()
  blogId: string;

  @IsOptional()
  authorId: string;
}
