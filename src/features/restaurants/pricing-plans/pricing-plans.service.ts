import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateOptions } from 'sequelize/types/model';

import { User } from '@features/users/users.model';

import { RestaurantPricingPlan } from '@relations/restaurant-pricing-plan/restaurant-pricing-plan.model';

import { IAttributes, IWhere } from '@shared/interfaces';
import { EmailService } from '@shared/modules/email';
import {
  TARIFF_EXPIRATIONS_REMINDER_SUBJECT,
  tariffExpirationReminder
} from '@shared/modules/email/templates';

import { MonobankPaymentService } from './monobank-payment.service';
import { BuyPricingPlanDto } from './pricing-plans.dto';
import {
  IBuyPricingPlanResponse,
  PaymentStatuses,
  PricingPlanTypes
} from './pricing-plans.interfaces';
import { PricingPlan } from './pricing-plans.model';
import { Restaurant } from '../restaurants.model';

@Injectable()
export class PricingPlansService {
  constructor(
    @InjectModel(PricingPlan) private readonly _pricingPlanRepository: typeof PricingPlan,
    @InjectModel(Restaurant) private _restaurantRepository: typeof Restaurant,
    @InjectModel(RestaurantPricingPlan)
    private readonly _restaurantPricingPlanRepository: typeof RestaurantPricingPlan,
    private readonly _paymentService: MonobankPaymentService,
    private readonly _emailService: EmailService,
    private readonly _configService: ConfigService
  ) {}

  public async paymentResponse(request: Request): Promise<void> {
    const response = this._paymentService.paymentResponse(request);
    console.log('paymentResponse', response);

    if (response.status === PaymentStatuses.Success) {
      this._confirmRestaurantPricingPlan(response.restaurantPricingPlanId);
    }
  }

  public async buy(data: BuyPricingPlanDto): Promise<IBuyPricingPlanResponse> {
    const pricingPlan = await this._getPricingPlan(data.pricingPlanId);
    const restaurantPricingPlan = await this._createRestaurantPricingPlan(
      pricingPlan,
      data.restaurantId
    );

    return this._paymentService.buy(pricingPlan.price, restaurantPricingPlan.id, data.restaurantId);
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

  public findPricingPlansEndDate(
    restaurantPricingPlans: RestaurantPricingPlan[] = []
  ): string | null {
    const latestPlan = restaurantPricingPlans.reduce((prevPlan, currentPlan) => {
      if ((!prevPlan || currentPlan.endDate > prevPlan.endDate) && currentPlan.paid) {
        return currentPlan;
      }
      return prevPlan;
    }, null);

    return latestPlan?.endDate || null;
  }

  public async createTrialRestaurantPricingPlan(
    restaurantId: string,
    options: CreateOptions = {}
  ): Promise<RestaurantPricingPlan> {
    const pricingPlan = await this._pricingPlanRepository.findOne({
      where: { type: PricingPlanTypes.Trial }
    });

    return await this._createRestaurantPricingPlan(pricingPlan, restaurantId, true, options);
  }

  private _getPricingPlan(id: string): Promise<PricingPlan> {
    return this._pricingPlanRepository.findOne({ where: { id } });
  }

  private async _createRestaurantPricingPlan(
    pricingPlan: PricingPlan,
    restaurantId: string,
    paid?: boolean,
    options: CreateOptions = {}
  ): Promise<RestaurantPricingPlan> {
    const currentPlans = await this._getCurrentRestaurantPricingPlans(restaurantId);
    const currentEndDate = new Date(this.findPricingPlansEndDate(currentPlans));
    let startDate = new Date();

    if (currentEndDate > startDate) {
      startDate = currentEndDate;
    }

    const endDate = this._createEndDate(startDate, pricingPlan.type);

    return this._restaurantPricingPlanRepository.create(
      {
        startDate: startDate.toISOString(),
        endDate: endDate,
        restaurantId,
        pricingPlanId: pricingPlan.id,
        paid
      },
      options
    );
  }

  private async _confirmRestaurantPricingPlan(id: string): Promise<void> {
    const pricingPlan = await this._getRestaurantPricingPlan(id);

    if (pricingPlan) {
      const [rowCount] = await this._restaurantPricingPlanRepository.update(
        { paid: true },
        { where: { id } }
      );
      if (rowCount === 0) {
        console.log(`The Restaurant Pricing Plan with ID ${id} has already been paid.`);
      } else {
        console.log(`Restaurant Pricing Plan with ID ${id} has been paid successfully.`);
      }
    } else {
      console.log(`Restaurant Pricing Plan with ID ${id} was not found`);
    }
  }

  private _createEndDate(startDate, pricingPlanType: PricingPlanTypes): string {
    const endDate = new Date(startDate);

    if (pricingPlanType === PricingPlanTypes.Annual) {
      endDate.setMonth(endDate.getMonth() + 12);
    } else if (pricingPlanType === PricingPlanTypes.SemiAnnual) {
      endDate.setMonth(endDate.getMonth() + 6);
    } else if (pricingPlanType === PricingPlanTypes.Monthly) {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setDate(endDate.getDate() + 14);
    }

    return endDate.toISOString();
  }

  private _getCurrentRestaurantPricingPlans(
    restaurantId: string
  ): Promise<RestaurantPricingPlan[] | null> {
    return this._restaurantPricingPlanRepository.findAll({
      where: {
        restaurantId
      }
    });
  }

  private _getRestaurantPricingPlan(id: string): Promise<RestaurantPricingPlan | null> {
    return this._restaurantPricingPlanRepository.findOne({ where: { id } });
  }

  @Cron(CronExpression.EVERY_HOUR)
  private _deleteNotPaidPricingPlans(): void {
    const currentTime = new Date();
    const expirationTime = new Date(currentTime.getTime() - 60 * 60 * 1000);

    this._restaurantPricingPlanRepository.destroy({
      where: { createdAt: { [Op.lt]: expirationTime }, paid: false }
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  private async _tariffExpirationReminder(): Promise<void> {
    const currentDate = new Date();
    const after3Days = new Date();
    after3Days.setDate(currentDate.getDate() + 3);

    const restaurantPricingPlanAttr: IAttributes<RestaurantPricingPlan> = ['endDate', 'id'];
    const restaurantPricingPlanWhere: IWhere<RestaurantPricingPlan> = {
      endDate: {
        [Op.gte]: currentDate
      },
      paid: true
    };

    const restaurantsWithPricingPlans = await this._restaurantRepository
      .findAll({
        include: [
          {
            model: RestaurantPricingPlan,
            as: 'plans',
            attributes: restaurantPricingPlanAttr,
            order: [['endDate', 'DESC']],
            limit: 1,
            where: restaurantPricingPlanWhere
          },
          {
            model: User
          }
        ]
      })
      .then(restaurants =>
        restaurants.filter(
          restaurant =>
            restaurant.plans.length && new Date(restaurant.plans[0].endDate) < after3Days
        )
      );

    restaurantsWithPricingPlans.forEach(restaurant => {
      restaurant.users.forEach(user => {
        this._emailService.send({
          subject: TARIFF_EXPIRATIONS_REMINDER_SUBJECT,
          to: user.email,
          html: tariffExpirationReminder({
            appLink: this._configService.get('APP_LINK'),
            restaurantId: restaurant.id,
            endDate: restaurant.plans[0].endDate
          })
        });
      });
    });
  }
}
