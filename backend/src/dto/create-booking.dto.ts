import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  readonly tickets: number;
  @IsString({ message: 'Invalid event ID' })
  readonly event: string;
  // @IsString({ message: 'Invalid user ID' })
  // readonly user: string;
}

