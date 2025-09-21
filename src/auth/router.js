import express from 'express'
import { emailMatches, emailUnique, emailValidator } from '../validators/email.validators.js';
import registration from './register.controller.js';
import { loginMatches, loginUnique, loginValidator } from '../validators/login.validators.js';
import { passwordConfirmation, passwordMatches, passwordValidator, resetPasswordValidator } from '../validators/password.validators.js';
import { fullNameValidator } from '../validators/fullName.validator.js';
import login from './login.controller.js';
import logout from './logout.controller.js';
import verifyMail from './verifyMail.controller.js';
import refreshToken from './refresh.controller.js';
import validationErrors from '../validators/validationErrorsMiddleware.js';
import { confirmReset, reset } from './passwordReset.js';

const authRouter = express.Router();


authRouter.post('/register', fullNameValidator(), loginValidator().custom(loginUnique), passwordValidator().custom(passwordConfirmation), emailValidator().custom(emailUnique), validationErrors, registration)
authRouter.post('/login', loginValidator().custom(loginMatches), emailValidator().custom(emailMatches), passwordValidator().custom(passwordMatches), validationErrors, login)
authRouter.post('/logout', logout)
authRouter.post('/password-reset', emailValidator(), validationErrors, reset)
authRouter.post('/password-reset/:confirm_token', resetPasswordValidator(), validationErrors, confirmReset)
authRouter.get('/verify/:token', verifyMail)
authRouter.get('/refresh', refreshToken)
export default authRouter;