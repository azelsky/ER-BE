import { IsNotEmpty } from 'class-validator';

export class CallWaiterDto {
  @IsNotEmpty({ message: 'Guest Id is required' })
  guestId: string;
}
