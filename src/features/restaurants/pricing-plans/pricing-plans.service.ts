import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { RestaurantPricingPlan } from '@relations/restaurant-pricing-plan/restaurant-pricing-plan.model';

import { MonobankPaymentService } from './monobank-payment.service';
import { BuyPricingPlanDto } from './pricing-plans.dto';
import { PricingPlanTypes } from './pricing-plans.interfaces';
import { PricingPlan } from './pricing-plans.model';

@Injectable()
export class PricingPlansService {
  constructor(
    @InjectModel(PricingPlan) private readonly _pricingPlanRepository: typeof PricingPlan,
    @InjectModel(RestaurantPricingPlan)
    private readonly _restaurantPricingPlanRepository: typeof RestaurantPricingPlan,
    private readonly _paymentService: MonobankPaymentService
  ) {}

  public async paymentResponse(request: Request): Promise<void> {
    const response = this._paymentService.paymentResponse(request);
    console.log('paymentResponse', response);
  }

  public async buy(data: BuyPricingPlanDto): Promise<string> {
    const pricingPlan = await this._getPricingPlan(data.pricingPlanId);
    const restaurantPricingPlan = await this._createRestaurantPricingPlan(
      pricingPlan,
      data.restaurantId
    );

    return this._paymentService.buy(pricingPlan.price, restaurantPricingPlan.id);
  }

  public getPricingPlans(): Promise<PricingPlan[]> {
    return this._pricingPlanRepository.findAll({
      where: {
        type: {
          [Op.not]: PricingPlanTypes.Trial
        }
      }
    });
  }

  private _getPricingPlan(id: string): Promise<PricingPlan> {
    return this._pricingPlanRepository.findOne({ where: { id } });
  }

  private async _createRestaurantPricingPlan(
    pricingPlan: PricingPlan,
    restaurantId: string
  ): Promise<RestaurantPricingPlan> {
    const currentPricingPlan = await this._getCurrentRestaurantPricingPlan(restaurantId);
    let startDate = new Date();

    if (currentPricingPlan) {
      startDate = new Date(currentPricingPlan.endDate);
    }

    const endDate = this._createEndDate(startDate, pricingPlan.type);

    return this._restaurantPricingPlanRepository.create({
      startDate: startDate,
      endDate: endDate,
      restaurantId,
      pricingPlanId: pricingPlan.id
    });
  }

  private _createEndDate(startDate, pricingPlanType: PricingPlanTypes): Date {
    const endDate = new Date(startDate);

    if (pricingPlanType === PricingPlanTypes.Annual) {
      endDate.setMonth(endDate.getMonth() + 12);
    } else if (pricingPlanType === PricingPlanTypes.SemiAnnual) {
      endDate.setMonth(endDate.getMonth() + 6);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    return endDate;
  }

  private _getCurrentRestaurantPricingPlan(restaurantId): Promise<RestaurantPricingPlan | null> {
    const currentDate = new Date();

    return this._restaurantPricingPlanRepository.findOne({
      where: {
        restaurantId,
        startDate: {
          [Op.lte]: currentDate
        },
        endDate: {
          [Op.gte]: currentDate
        },
        payed: true
      }
    });
  }
}
