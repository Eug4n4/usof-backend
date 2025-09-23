import { body } from "express-validator";

const roleCreateValidator = () => body('role').exists().isIn(['admin', 'user'])
const roleUpdateValidator = () => body('role').optional().isIn(['admin', 'user'])
export { roleCreateValidator, roleUpdateValidator }