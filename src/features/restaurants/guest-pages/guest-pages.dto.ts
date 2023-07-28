import { IsNotEmpty } from 'class-validator';

import { GuestPage } from '@features/restaurants/guest-pages/guest-pages.model';

export class UpdateGuestPageDto extends GuestPage {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  successTextColor: string;

  @IsNotEmpty()
  successBackground: string;
}
