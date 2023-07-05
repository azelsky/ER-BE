import { Body, Controller, Get, Post, Req } from '@nestjs/common';

import { SkipAuthGuard } from '@core/auth/decorators';

import { BuyPricingPlanDto } from './pricing-plans.dto';
import { PricingPlan } from './pricing-plans.model';
import { PricingPlansService } from './pricing-plans.service';

@Controller('restaurants/pricing-plans')
export class PricingPlansController {
  constructor(private readonly _pricingPlansService: PricingPlansService) {}

  @SkipAuthGuard()
  @Post('payment-response')
  public async monobankPaymentResponse(@Req() request: Request): Promise<void> {
    this._pricingPlansService.paymentResponse(request);
  }

  @Post('buy')
  public async buy(@Body() data: BuyPricingPlanDto): Promise<string> {
    return this._pricingPlansService.buy(data);
  }

  @Get('all')
  public getPricingPlans(): Promise<PricingPlan[]> {
    return this._pricingPlansService.getPricingPlans();
  }
}
