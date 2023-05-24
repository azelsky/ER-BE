import { TRestaurantDetails } from './interfaces/reataurant-details.type';
import { IRelatedRestaurant } from './interfaces/related-restaurant.interface';

export const RESTAURANT_DETAILS_FIELDS: (keyof TRestaurantDetails)[] = ['id', 'name'];
export const RELATED_RESTAURANT_FIELDS: (keyof IRelatedRestaurant)[] = ['id', 'name', 'subdomain'];
