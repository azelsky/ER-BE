import { Role } from '@features/roles';

import { Restaurant } from '../restaurants.model';

export interface IRelatedRestaurant extends Pick<Restaurant, 'id' | 'name' | 'subdomain'> {
  roles: TRelatedRestaurantRole[];
}

export type TRelatedRestaurantRole = Pick<Role, 'name' | 'value' | 'id'>;
