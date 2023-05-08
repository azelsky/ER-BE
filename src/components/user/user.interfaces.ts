import { Error } from '../../shared/classes/error';

export interface UserEmailExistsRequest {
  email: string;
}

export interface UserEmailExistsResponse {
  isExist: boolean;
}

export interface UserEmailExistsErrorResponse {
  error: Error;
}
