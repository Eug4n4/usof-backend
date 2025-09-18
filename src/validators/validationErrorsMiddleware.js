import { validationResult } from "express-validator"


const validationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        next();
    } else {
        res.status(400);
        res.json(errors.array());
    }
}

export default validationErrors;