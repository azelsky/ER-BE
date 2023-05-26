import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserRoleDto {
  @IsNotEmpty({ message: 'User Id is required' })
  @IsUUID('4', { message: 'Invalid User Id format' })
  userId: string;

  @IsNotEmpty({ message: 'Role is required' })
  roleId: number;
}
