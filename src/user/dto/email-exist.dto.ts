import { IsEmail } from 'class-validator';

export class EmailExistsDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;
}
