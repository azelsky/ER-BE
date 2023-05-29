import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { User } from '../users.model';

interface DeviceCreationAttr {
  id: string;
  userId: string;
  token: string;
}

@Table({ tableName: 'devices', createdAt: false, updatedAt: false })
export class Device extends Model<Device, DeviceCreationAttr> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false
  })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  token: string;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  user: User;
}
