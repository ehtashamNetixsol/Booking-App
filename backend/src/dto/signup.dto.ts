import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class signUpDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  // @IsNotEmpty()
  // @IsString()
  // readonly role: 'user' | 'writer' | 'admin';

  @IsString()
  @IsOptional()
  status: string;
}
