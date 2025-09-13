import { matchedData, validationResult } from "express-validator";


const login = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        res.json(errors.array());
    } else {
        const { login, email } = matchedData(req);
        res.status(200);
        res.json({ "user": { login, email } })
    }
}

export default login;