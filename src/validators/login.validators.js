import { body } from "express-validator";
import User from "../models/User.js";


const loginValidator = () => body('login').exists().not().matches(/\s+/).isLength({ min: 6, max: 20 })
const loginUnique = async (login) => {
    const user = await User.findBy('login', login);
    if (user) {
        throw new Error('Login is already in use');
    }
}
const loginMatches = async (login) => {
    const user = await User.findBy('login', login);
    if (!user) {
        throw new Error('Login didn\'t match')
    }
}


export { loginValidator, loginUnique, loginMatches };