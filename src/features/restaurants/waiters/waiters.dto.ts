import { IsIn, IsNotEmpty } from 'class-validator';

import { TMessengerType } from './waiters.interfaces';

export class CreateWaiterDto {
  @IsNotEmpty()
  name: string;
}

export class ConfirmWaiterDto {
  @IsNotEmpty()
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
}
