import { Request, Response } from 'express-serve-static-core';
import { validationResult } from 'express-validator';

import {
  UserEmailExistsErrorResponse,
  UserEmailExistsRequest,
  UserEmailExistsResponse
} from './user.interfaces';
import { userEmailExist } from './user.model';
import { Error } from '../../shared/classes/error';

export async function httpUserEmailExists(
  req: Request<UserEmailExistsRequest>,
  res: Response<UserEmailExistsResponse | UserEmailExistsErrorResponse>
): Promise<Response<UserEmailExistsResponse | UserEmailExistsErrorResponse>> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errors.array()[0];

      return res.status(400).json({ error: new Error(error.type, error.msg) });
    }

    const { email } = req.params;
    const isExist = await userEmailExist(email);

    return res.status(200).json({
      isExist
    });
  } catch (error) {
    console.error('Error in httpUserEmailExists:', error);

    return res
      .status(500)
      .json({ error: new Error('Internal server error', 'Something went wrong') });
  }
}
