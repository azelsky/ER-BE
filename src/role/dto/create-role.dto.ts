import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Value is required' })
  readonly value: string;

  @IsNotEmpty({ message: 'Description is required' })
  readonly description: string;
}
