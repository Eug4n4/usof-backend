import { body } from "express-validator";


const loginValidator = () => body('login').exists().trim().notEmpty().not().matches(/\s+/).isLength({ min: 6, max: 20 })


export { loginValidator };