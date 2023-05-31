import { IsNotEmpty } from 'class-validator';

export class CreateTableDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}
