import { UUIDV4 } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

import { PricingPlanTypes } from './pricing-plans.interfaces';

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

  @Column({ type: DataType.STRING, allowNull: false })
  type: PricingPlanTypes;
}
