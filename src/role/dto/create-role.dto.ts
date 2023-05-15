import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Value is required' })
  readonly value: string;

  @IsNotEmpty({ message: 'Name is required' })
  readonly name: string;
}
