import { Controller, Get } from '@nestjs/common';

import { Role } from './roles.model';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private _rolesService: RolesService) {}

  @Get()
  public async getRoles(): Promise<Role[]> {
    return this._rolesService.getRoles();
  }
}
