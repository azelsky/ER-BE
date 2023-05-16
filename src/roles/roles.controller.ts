import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';

import { Roles } from '@shared/constants';

import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';

@Controller('role')
export class RolesController {
  constructor(private _rolesService: RolesService) {}

  @Post()
  public crete(@Body() dto: CreateRoleDto): Promise<CreateRoleDto> {
    return this._rolesService.createRole(dto);
  }

  @Get(':value')
  public async getByValue(@Param('value') value: Roles): Promise<CreateRoleDto | null> {
    const role = await this._rolesService.getRoleByValue(value);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }
}
