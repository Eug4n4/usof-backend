import { body } from "express-validator"


const categoryValidator = [
    body('title').exists().isLength({ max: 100 }),
    body('description').isLength({ max: 200 })
]

export { categoryValidator }