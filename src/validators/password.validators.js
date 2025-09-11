import { body } from "express-validator";


const passwordValidator = () => body('password').exists()
	.withMessage("passwordnot exists").notEmpty().withMessage("password empty").isLength({ min: 8 }).bail()
const passwordConfirmation = (password, { req }) => {
	if (password !== req.body.password_confirm) {
		throw new Error('Confirm password and password didn\'t match')
	}
	return true
}

export { passwordValidator, passwordConfirmation };