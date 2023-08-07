import { UUIDV4 } from 'sequelize';
import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';

import { RestaurantPricingPlan } from '@relations/restaurant-pricing-plan/restaurant-pricing-plan.model';

import { PricingPlanTypes } from './pricing-plans.interfaces';
import { Restaurant } from '../restaurants.model';

@Table({ tableName: 'pricing_plans', createdAt: false, updatedAt: false })
export class PricingPlan extends Model<PricingPlan> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.DECIMAL(10, 2) })
  price: number;

  @Column({ type: DataType.DECIMAL(10, 2), field: 'display_price' })
  displayPrice: number;

  @Column({ type: DataType.STRING, allowNull: false })
  type: PricingPlanTypes;

  @BelongsToMany(() => Restaurant, () => RestaurantPricingPlan)
  restaurants: Restaurant[];
}
