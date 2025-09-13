import { validationResult } from 'express-validator';
import User from '../models/User.js';
import hash_password from '../utils/hash_password.js';


const registration = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        res.json(errors.array());
    } else {
        const { login, full_name, email, password } = req.body;
        const role_id = 1;
        hash_password(password).then(hashed => {
            new User({ login, full_name, email, password: hashed, role_id }).save();
        })
        res.status(201);
        res.json({ "user": { login, full_name, email, role_id } })
    }
}

export default registration;