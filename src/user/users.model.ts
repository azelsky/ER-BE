import { UUIDV4 } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface UserCreatingAttr {
  name: string;
  email: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreatingAttr> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;
}
