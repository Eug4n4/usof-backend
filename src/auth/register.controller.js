import { validationResult } from 'express-validator';
import User from '../models/User.js';
import hash_password from '../utils/hash_password.js';
import sendVerificationMail from '../mail/sendMail.js';
import UserDto from '../dto/UserDto.js';

const registration = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        res.json(errors.array());
    } else {
        const { login, full_name, email, password } = req.body;
        const role_id = 1;
        const hashed = await hash_password(password);
        await new User({ login, full_name, email, password: hashed, role_id }).save();
        const user = await User.findBy('login', login);
        const dto = await UserDto.createInstance(user);
        sendVerificationMail(email);
        res.status(201);
        res.json(dto)
    }
}

export default registration;