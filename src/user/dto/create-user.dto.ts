import { IsEmail, IsNotEmpty, IsUUID, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  readonly email: string;

  @Length(2, 255, { message: 'Name must be between 2 and 255 characters' })
  @IsNotEmpty({ message: 'Name is required' })
  readonly name: string;

  @IsUUID('4', { message: 'Invalid Cognito ID format' })
  readonly cognitoId: string;
}
