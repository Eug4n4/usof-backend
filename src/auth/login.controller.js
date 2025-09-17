import { matchedData, validationResult } from "express-validator";
import User from "../models/User.js";
import { createTokenPair } from "../utils/generateTokens.js";
import UserDto from "../dto/UserDto.js";

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        res.json(errors.array());
    } else {
        if (req.cookies['access'] && req.cookies['refresh']) {
            res.json({})
        } else {
            const { login, email } = matchedData(req);
            const user = await User.getByEmail(email);
            const userDto = await UserDto.createInstance(user)
            const { access, refresh } = createTokenPair(userDto, 10 * 60 * 1000, 2 * 60 * 60 * 1000)
            res.cookie("access", access['token'], { expires: new Date(access['expires']) })
            res.cookie("refresh", refresh['token'], { httpOnly: true, expires: new Date(refresh['expires']) })
            res.json(userDto)
        }
    }
}

export default login;