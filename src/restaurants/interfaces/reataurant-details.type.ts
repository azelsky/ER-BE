import { Restaurant } from '../restaurants.model';

export type TRestaurantDetails = Pick<Restaurant, 'id' | 'name'>;
