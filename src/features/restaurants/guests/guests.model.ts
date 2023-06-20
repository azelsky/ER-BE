import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { RTable } from '../tables/tables.model';

interface GuestCreationAttr {
  id: string;
  tableId: string;
  name?: string;
}

@Table({ tableName: 'guests', updatedAt: false })
export class Guest extends Model<Guest, GuestCreationAttr> {
  @Column({
    type: DataType.UUID,
    primaryKey: true
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string;

  @Column({ field: 'created_at' })
  createdAt: Date;

  @ForeignKey(() => RTable)
  @Column({ type: DataType.UUID, allowNull: false, field: 'table_id' })
  tableId: string;

  @BelongsTo(() => RTable, { onDelete: 'CASCADE' })
  table: RTable;
}
