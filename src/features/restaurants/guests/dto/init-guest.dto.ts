import { IsNotEmpty } from 'class-validator';

export class InitGuestDto {
  @IsNotEmpty({ message: 'Guest Id is required' })
  guestId: string;

  @IsNotEmpty({ message: 'Table Id is required' })
  tableId: string;
}
