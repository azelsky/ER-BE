import express from 'express';

import { userRouter } from './components/user/user.routes';

export const routes = express.Router();

routes.use('/user', userRouter);
