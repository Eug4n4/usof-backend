import { body } from "express-validator";


const fullNameValidator = () => body('full_name').exists().matches(/^([a-zA-Z]+\s?)+$/).isLength({ max: 50 })

export { fullNameValidator };