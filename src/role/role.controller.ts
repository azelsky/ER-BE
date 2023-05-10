import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';

import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private _roleService: RoleService) {}

  @Post()
  public crete(@Body() dto: CreateRoleDto): Promise<CreateRoleDto> {
    return this._roleService.createRole(dto);
  }

  @Get(':value')
  public async getByValue(@Param('value') value: string): Promise<CreateRoleDto | null> {
    const role = await this._roleService.getRoleByValue(value);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }
}
