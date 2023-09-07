import { IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  title: string;
}
