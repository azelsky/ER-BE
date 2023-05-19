import { IsNotEmpty, Length, Matches } from 'class-validator';

export class SubdomainParameterDto {
  @Length(2, 255, { message: 'Subdomain must be between 2 and 255 characters' })
  @IsNotEmpty({ message: 'Subdomain is required' })
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Subdomain can only contain lowercase letters, numbers, hyphens (-).'
  })
  readonly subdomain: string;
}
