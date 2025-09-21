import { query } from "express-validator";


const queryValidator = [
    query('status').optional().isIn(['active', 'inactive']),
    query('page').optional().isInt(),
    query('startDate').optional().isDate(),
    query('endDate').optional().isDate(),
    query(['sort', 'order']).optional().custom((value, { req }) => {
        const hasSort = req.query.sort != undefined;
        const hasOrder = req.query.order != undefined;

        if (hasSort != hasOrder) {
            throw new Error('Sort and order must be provided together')
        }
        if (!['likes', 'date'].includes(req.query.sort)) {
            throw new Error('Sort must be likes / date')
        }
        if (!['desc', 'asc'].includes(req.query.order)) {
            throw new Error('Order must be desc / asc')
        }
    })
]

export default queryValidator;