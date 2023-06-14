import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { RTable } from '../tables/tables.model';

interface GuestCreationAttr {
  id: string;
  tableId: string;
  name?: string;
}

@Table({ tableName: 'guests', createdAt: false, updatedAt: false })
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

  @ForeignKey(() => RTable)
  @Column({ type: DataType.UUID, allowNull: false, field: 'table_id' })
  tableId: string;

  @BelongsTo(() => RTable, { onDelete: 'CASCADE' })
  table: RTable;
}
