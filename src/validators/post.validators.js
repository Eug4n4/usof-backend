import { body } from "express-validator";



const postValidator = [
    body('title').exists().isLength({ min: 10, max: 50 }),
    body('content').exists().isLength({ min: 50 }),
    body('categories').isArray({ min: 1 }).exists(),
    body('active').optional().isInt({ min: 0, max: 1 })
]

export { postValidator }