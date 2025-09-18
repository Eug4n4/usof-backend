import { body } from "express-validator";


const commentValidator = [
    body('content').exists().isLength({ max: 500 })
]

export default commentValidator;