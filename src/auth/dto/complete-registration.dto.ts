import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CompleteRegistrationDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(2, 255, { message: 'Name must be between 2 and 255 characters' })
  name: string;

  /* Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character */
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password' }
  )
  password: string;
}
