export interface IRelatedRestaurant {
  id: string;
  name: string;
  subdomain: string;
  roles: {
    name: string;
    value: string;
  }[];
}
