import { query } from "express-validator";


const paginationValidator = [
    query('page').optional().isInt(),
    query('pageSize').optional().isInt(),
]

const queryValidator = [
    query('status').optional().isIn(['active', 'inactive']),
    query('page').optional().isInt(),
    query('startDate').optional().isDate(),
    query('endDate').optional().isDate(),
    query('pageSize').optional().isInt(),
    query(['sort', 'order']).optional().custom((value, { req }) => {
        const hasSort = req.query.sort != undefined;
        const hasOrder = req.query.order != undefined;

        if (hasSort != hasOrder) {
            throw new Error('Sort and order must be provided together')
        }
        if (!['likes', 'dislikes', 'date'].includes(req.query.sort)) {
            throw new Error('Sort must be likes / dislikes / date')
        }
        if (!['desc', 'asc'].includes(req.query.order)) {
            throw new Error('Order must be desc / asc')
        }
        return true;
    })
]

export { queryValidator, paginationValidator };