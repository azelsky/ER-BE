import { IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateRestaurantDto {
  @Length(2, 255, { message: 'Name must be between 2 and 255 characters' })
  @IsNotEmpty({ message: 'Name is required' })
  readonly name: string;

  @Length(2, 255, { message: 'Subdomain must be between 2 and 255 characters' })
  @IsNotEmpty({ message: 'Subdomain is required' })
  @Matches(/^[a-z-]+$/, {
    message: 'Subdomain can only contain lowercase letters, hyphens (-).'
  })
  readonly subdomain: string;
}
