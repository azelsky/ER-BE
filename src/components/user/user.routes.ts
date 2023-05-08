import express from 'express';
import { check } from 'express-validator';

import { httpUserEmailExists } from './user.controller';

export const userRouter = express.Router();

userRouter.get(
  '/email-exists/:email',
  [check('email').isEmail().withMessage('Invalid email address')],
  httpUserEmailExists
);
