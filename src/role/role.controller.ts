import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';

import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private _roleService: RoleService) {}

  @UsePipes(ValidationPipe)
  @Post()
  public crete(@Body() dto: CreateRoleDto): Promise<CreateRoleDto> {
    return this._roleService.createRole(dto);
  }

  @UsePipes(ValidationPipe)
  @Get(':value')
  public async getByValue(@Param('value') value: string): Promise<CreateRoleDto | null> {
    const role = await this._roleService.getRoleByValue(value);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }
}
