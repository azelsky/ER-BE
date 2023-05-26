import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class AuthRegisterDto {
  @IsString()
  @Length(2, 255, { message: 'Name must be between 2 and 255 characters' })
  name: string;

  @IsEmail()
  email: string;

  @Length(2, 255, { message: 'Restaurant Name must be between 2 and 255 characters' })
  @IsNotEmpty({ message: 'Restaurant Name is required' })
  readonly restaurantName: string;

  @Length(2, 255, { message: 'Subdomain must be between 2 and 255 characters' })
  @IsNotEmpty({ message: 'Subdomain is required' })
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Subdomain can only contain lowercase letters, numbers, hyphens (-).'
  })
  readonly subdomain: string;

  /* Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character */
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password' }
  )
  password: string;
}
