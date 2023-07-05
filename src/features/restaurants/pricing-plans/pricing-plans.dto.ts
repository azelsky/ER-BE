import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { PricingPlanTypes } from './pricing-plans.interfaces';

export class BuyPricingPlanDto {
  @IsNotEmpty()
  @IsString()
  restaurantId: string;

  @IsNotEmpty()
  @IsEnum(PricingPlanTypes)
  pricingPlanId: string;
}
