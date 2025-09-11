import express from 'express'
import { emailUnique, emailValidator } from '../validators/email.validators.js';
import registration from './register.controller.js';
import { loginUnique, loginValidator } from '../validators/login.validators.js';
import { passwordConfirmation, passwordValidator } from '../validators/password.validators.js';
import { fullNameValidator } from '../validators/fullName.validator.js';

const authRouter = express.Router();


authRouter.post('/register', fullNameValidator(), loginValidator().custom(loginUnique), passwordValidator().custom(passwordConfirmation), emailValidator().custom(emailUnique), registration)

export default authRouter;