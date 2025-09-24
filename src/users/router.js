import express from 'express'
import authMiddleware from '../auth/authMiddleware.js'
import { getByParameter } from '../utils/getByParameter.js';
import User from '../models/User.js';
import { fullNameValidator } from '../validators/fullName.validator.js';
import { loginValidator, loginUnique } from '../validators/login.validators.js';
import { passwordConfirmation, passwordValidator, updatePasswordValidator } from '../validators/password.validators.js';
import { emailUnique, emailValidator } from '../validators/email.validators.js';
import validationErrors from '../validators/validationErrorsMiddleware.js';
import { createUser, deleteUser, getFavorites, updateUser, uploadAvatar } from './users.controller.js';
import { roleCreateValidator, roleUpdateValidator } from '../validators/role.validators.js';
import { mustBeAdmin, mustBeAdminOrSelf } from "../utils/permissionCheck.js";
import upload from './avatars.js';

const userRouter = express.Router();

userRouter.get('/', getByParameter(undefined, User.getAll))
userRouter.get('/favorites', authMiddleware, getFavorites)
userRouter.get('/:user_id', getByParameter('user_id', User.getById))
userRouter.post('/', authMiddleware,
    mustBeAdmin,
    fullNameValidator(),
    loginValidator().custom(loginUnique),
    passwordValidator().custom(passwordConfirmation),
    emailValidator().custom(emailUnique),
    roleCreateValidator(),
    validationErrors,
    createUser)
userRouter.patch('/:user_id', authMiddleware,
    mustBeAdminOrSelf,
    fullNameValidator(),
    updatePasswordValidator(),
    roleUpdateValidator(),
    validationErrors,
    updateUser)
userRouter.patch('/:user_id/avatar', authMiddleware, mustBeAdminOrSelf, upload.single('avatar'), uploadAvatar)
userRouter.delete('/:user_id', authMiddleware, mustBeAdmin, deleteUser)
export default userRouter;