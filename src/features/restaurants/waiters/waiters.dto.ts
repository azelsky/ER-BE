import { IsIn, IsNotEmpty, Length } from 'class-validator';

import { TMessengerType } from './waiters.interfaces';

export class CreateWaiterDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty({ message: 'Restaurant Id is required' })
  readonly restaurantId: string;
}

export class ConfirmWaiterDto {
  @IsNotEmpty()
  @Length(6, 6, { message: 'Confirmation code must be exactly 6 characters' })
  confirmationCode: string;
  @IsNotEmpty()
  messengerUserId: string;

  @IsIn(['telegram'], { message: 'Invalid messenger type' })
  messengerType: TMessengerType;

  @IsNotEmpty({ message: 'Token is required' })
  token: string;
}

export class IsAuthorizedDto {
  @IsNotEmpty()
  messengerUserId: string;

  @IsNotEmpty({ message: 'Token is required' })
  token: string;
}
