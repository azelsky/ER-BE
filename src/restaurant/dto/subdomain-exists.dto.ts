import { IsString, Matches } from 'class-validator';

export class SubdomainExistsDto {
  @IsString()
  @Matches(/^[a-z-]+$/, {
    message: 'Subdomain can only contain lowercase letters, hyphens (-).'
  })
  subdomain: string;
}
