import { User } from '@features/users/users.model';

export type TTeamMember = Pick<User, 'id' | 'name' | 'email' | 'roles'>;
