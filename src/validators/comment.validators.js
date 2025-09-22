import { body } from "express-validator";


const commentValidator = [
    body('content').exists().isLength({ max: 500 })
]

const commentEditValidator = [
    body('active').exists().isInt({ min: 0, max: 1 })
]

export { commentValidator, commentEditValidator };