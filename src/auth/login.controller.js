import { matchedData, validationResult } from "express-validator";
import User from "../models/User.js";
import { createTokenPair } from "../utils/generateTokens.js";
import UserDto from "../dto/UserDto.js";

const login = async (req, res) => {

    if (req.cookies['access'] && req.cookies['refresh']) {
        res.json({})
    } else {
        const { login, email } = matchedData(req);
        const user = await User.getByEmail(email);
        if (user.is_active) {
            const userDto = await UserDto.createInstance(user)
            const { access, refresh } = createTokenPair(userDto)
            res.cookie("access", access['token'], { expires: new Date(access['expires']) })
            res.cookie("refresh", refresh['token'], { httpOnly: true, expires: new Date(refresh['expires']) })
            res.json(userDto)
        } else {
            res.status(400);
            res.json({ 'message': 'Please verify your email' })
        }
    }

}

export default login;