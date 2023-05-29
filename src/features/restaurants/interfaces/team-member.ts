import { User } from '../../users';

export type TTeamMember = Pick<User, 'id' | 'name' | 'email' | 'roles'>;
