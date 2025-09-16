import { body, matchedData } from "express-validator";
import User from "../models/User.js";
import { compareSync } from "bcrypt";


const passwordValidator = () => body('password').exists()
    .withMessage("passwordnot exists").notEmpty().withMessage("password empty").isLength({ min: 8 }).bail()
const passwordConfirmation = (password, { req }) => {
    if (password !== req.body.password_confirm) {
        throw new Error('Confirm password and password didn\'t match')
    }
    return true
}
const passwordMatches = async (password, { req }) => {
    const validated = matchedData(req);
    const fieldName = validated['login'] ? 'login' : validated['email'] ? 'email' : undefined;
    if (fieldName) {
        const user = await User.findBy(fieldName, validated[fieldName]);
        if (!compareSync(password, user.password)) {
            throw new Error('Password didn\'t match')
        }
    }

}

export { passwordValidator, passwordConfirmation, passwordMatches };