import { validationResult } from 'express-validator';
import User from '../models/User.js';


const registration = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        res.json(errors.array());
    } else {
        const { login, full_name, email, password } = req.body;
        const role_id = 1;
        const user = new User({ login, full_name, email, password, role_id });
        user.save();
        res.status(201);
        res.json({ "user": { login, full_name, email, role_id } })
    }
}

export default registration;