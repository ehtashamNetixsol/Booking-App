import {
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Category } from 'src/schemas/category.schema';

import { User } from 'src/schemas/user.schema';

export class UpdateBlogDto {
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  @IsOptional()
  readonly title: string;
  @IsNotEmpty()
  @IsOptional()
  thumbnail: string;

  @IsOptional()
  status: string;

  @IsNotEmpty()
  @IsOptional()
  readonly description: string;

  @IsEmpty({ message: 'You cannot pass userid' })
  readonly user: User;

  @IsNotEmpty()
  @IsOptional()
  readonly category: Category;
}
