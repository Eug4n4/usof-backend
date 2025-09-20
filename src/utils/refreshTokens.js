import jwt from 'jsonwebtoken'
import User from '../models/User.js';
import Token from '../models/Token.js';
import { createTokenPair } from './generateTokens.js';
import UserDto from '../dto/UserDto.js';

const refresh = async (refreshToken) => {
    const tokenData = jwt.verify(refreshToken, process.env.JWT_SECRET)
    const user = await User.findBy('id', tokenData['id'])
    const token = await Token.findBy('refresh', refreshToken)
    if (!token) {
        throw new Error("Unauthorized");
    }
    await token.delete()
    const userDto = UserDto.createInstance(user)
    const { access, refresh } = createTokenPair(userDto);
    return { access, refresh }
}

export default refresh;