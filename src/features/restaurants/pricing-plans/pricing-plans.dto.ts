import { IsNotEmpty, IsString } from 'class-validator';

export class BuyPricingPlanDto {
  @IsNotEmpty()
  @IsString()
  restaurantId: string;

  @IsNotEmpty()
  @IsString()
  pricingPlanId: string;
}
