import { User } from '../../users/users.model';

export type TTeamMember = Pick<User, 'id' | 'name' | 'email' | 'roles'>;
