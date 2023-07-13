import { Role } from '@features/roles/roles.model';

import { Restaurant } from '../restaurants.model';

export interface IRelatedRestaurant extends Pick<Restaurant, 'id' | 'name' | 'subdomain'> {
  roles: TRelatedRestaurantRole[];
  endDate: string | null;
}

export type TRelatedRestaurantRole = Pick<Role, 'name' | 'value' | 'id'>;
