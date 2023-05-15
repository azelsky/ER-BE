import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserService } from '../../user/user.service';
import { Roles, ROLES_ALLOWED_KEY } from '../constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector, private readonly _userService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireRoles = this._reflector.getAllAndOverride<Array<Roles>>(ROLES_ALLOWED_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requireRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const roles = await this._userService.getUserRolesForRestaurant(
      request.user.idUser,
      request.params.restaurantId
    );

    return this._isAllowed(roles, requireRoles);
  }

  private _isAllowed(roles: Array<Roles>, requireRoles: Array<Roles>): boolean {
    if (roles.includes(Roles.Owner)) return true;

    return roles.some(role => requireRoles.includes(role));
  }
}
