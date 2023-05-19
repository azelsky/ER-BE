import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/sequelize';

import { Role } from '../../roles/roles.model';
import { User } from '../../users/users.model';
import { Roles, ROLES_ALLOWED_KEY } from '../constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
    @InjectModel(User) private _userRepository: typeof User
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireRoles = this._reflector.getAllAndOverride<Array<Roles>>(ROLES_ALLOWED_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requireRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const roles = await this._getUserRolesForRestaurant(
      request.user.idUser,
      request.params.restaurantId
    );

    return this._isAllowed(roles, requireRoles);
  }

  private _isAllowed(roles: Array<Roles>, requireRoles: Array<Roles>): boolean {
    if (roles.includes(Roles.Owner)) return true;

    return roles.some(role => requireRoles.includes(role));
  }

  private _getUserRolesForRestaurant(
    cognitoId: string,
    restaurantId: string
  ): Promise<Array<Roles>> {
    return this._userRepository
      .findOne({
        where: { cognitoId },
        include: [
          {
            model: Role,
            attributes: ['value'],
            through: { attributes: [], where: { restaurantId } }
          }
        ]
      })
      .then(user => {
        if (!user) {
          return [];
        } else {
          return user.roles.map(role => role.value);
        }
      });
  }
}
