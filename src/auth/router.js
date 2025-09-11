import express from 'express'
import { emailUnique, emailValidator } from '../validators/email.validators.js';
import registration from './register.controller.js';
import { loginValidator } from '../validators/login.validators.js';
import { passwordConfirmation, passwordValidator } from '../validators/password.validators.js';

const authRouter = express.Router();


authRouter.post('/register', loginValidator(), passwordValidator().custom(passwordConfirmation), emailValidator().custom(emailUnique), registration)

export default authRouter;