import {
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Category } from 'src/schemas/category.schema';
import { User } from 'src/schemas/user.schema';

export class CreateBlogDto {
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  @IsOptional()
  thumbnail: string;

  @IsOptional()
  status: string;

  @IsNotEmpty()
  readonly description: string;

  @IsEmpty({ message: 'You cannot pass userid' })
  readonly user: User;

  @IsNotEmpty({ message: 'You cannot pass catid' })
  readonly category: Category;
}
