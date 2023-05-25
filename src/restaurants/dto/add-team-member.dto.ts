import { ArrayMinSize, IsArray, IsEmail } from 'class-validator';

export class AddTeamMemberDto {
  @IsEmail()
  email: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one role is required' })
  roles: number[];
}
