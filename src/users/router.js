import express from 'express'
import { getByParameter } from '../utils/getByParameter.js';
import User from '../models/User.js';

const userRouter = express.Router();

userRouter.get('/', getByParameter(undefined, User.getAll))
userRouter.get('/:user_id', getByParameter('user_id', User.getById))
export default userRouter;