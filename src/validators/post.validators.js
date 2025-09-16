import { body } from "express-validator";


const postValidator = () => body('title').exists().isLength({ min: 10, max: 150 })
const contentExists = () => body('content').exists().isLength({ min: 50 })
const categoriesExists = () => body('categories').isArray().exists()

export { postValidator, contentExists, categoriesExists }