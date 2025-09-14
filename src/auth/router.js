import express from 'express'
import { emailMatches, emailUnique, emailValidator } from '../validators/email.validators.js';
import registration from './register.controller.js';
import { loginMatches, loginUnique, loginValidator } from '../validators/login.validators.js';
import { passwordConfirmation, passwordMatches, passwordValidator } from '../validators/password.validators.js';
import { fullNameValidator } from '../validators/fullName.validator.js';
import login from './login.controller.js';
import logout from './logout.controller.js';

const authRouter = express.Router();


authRouter.post('/register', fullNameValidator(), loginValidator().custom(loginUnique), passwordValidator().custom(passwordConfirmation), emailValidator().custom(emailUnique), registration)
authRouter.post('/login', loginValidator().custom(loginMatches), emailValidator().custom(emailMatches), passwordValidator().custom(passwordMatches), login)
authRouter.post('/logout', logout)
export default authRouter;