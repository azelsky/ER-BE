import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { Roles, ROLES_ALLOWED_KEY } from '../constants';

export const RolesAllowed = (...roles: Array<Roles>): CustomDecorator<typeof ROLES_ALLOWED_KEY> =>
  SetMetadata<typeof ROLES_ALLOWED_KEY, Array<Roles>>(ROLES_ALLOWED_KEY, roles);
