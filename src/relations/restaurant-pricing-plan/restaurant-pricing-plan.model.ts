import { UUIDV4 } from 'sequelize';
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { PricingPlan } from '@features/restaurants/pricing-plans/pricing-plans.model';
import { Restaurant } from '@features/restaurants/restaurants.model';

interface RestaurantPricingPlanCreationAttr {
  startDate: string;
  endDate: string;
  restaurantId: string;
  pricingPlanId: string;
  paid?: boolean;
}

@Table({ tableName: 'restaurant_pricing_plan', updatedAt: false })
export class RestaurantPricingPlan
  extends Model<RestaurantPricingPlan, RestaurantPricingPlanCreationAttr>
  implements RestaurantPricingPlanCreationAttr
{
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  })
  id: string;

  @Column({ field: 'start_date', type: DataType.DATE })
  startDate: string;

  @Column({ field: 'end_date', type: DataType.DATE })
  endDate: string;

  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  paid: boolean;

  @ForeignKey(() => Restaurant)
  @Column({ type: DataType.UUID, field: 'restaurant_id' })
  restaurantId: string;

  @ForeignKey(() => PricingPlan)
  @Column({ type: DataType.UUID, field: 'pricing_plan_id' })
  pricingPlanId: string;

  @BelongsTo(() => PricingPlan, { foreignKey: 'pricing_plan_id', onDelete: 'CASCADE' })
  pricingPlan: PricingPlan;

  @BelongsTo(() => Restaurant, { foreignKey: 'restaurant_id', onDelete: 'CASCADE' })
  restaurant: Restaurant;
}
