import { IsNotEmpty } from 'class-validator';

export class RestaurantIdParameterDto {
  @IsNotEmpty({ message: 'Restaurant Id is required' })
  readonly restaurantId: string;
}
