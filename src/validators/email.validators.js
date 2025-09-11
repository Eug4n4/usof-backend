import { body } from "express-validator";
import User from "../models/User.js";


const emailValidator = () => body('email').isEmail().bail();
const emailUnique = async (email) => {
	const user = await User.findBy('email', email);
	if (user) {
		throw new Error('Email already in use')
	}
}

export { emailValidator, emailUnique };