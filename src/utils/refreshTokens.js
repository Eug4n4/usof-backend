import jwt from 'jsonwebtoken'
import User from '../models/User.js';
import Token from '../models/Token.js';
import { createTokenPair } from './generateTokens.js';

const refresh = async (refreshToken) => {
    const tokenData = jwt.verify(refreshToken, process.env.JWT_SECRET)
    const user = await User.findBy('email', tokenData['email'])
    const token = await Token.findBy('refresh', refreshToken)
    if (!token) {
        throw new Error("Unauthorized");
    }
    await token.delete()
    const { access, refresh } = createTokenPair(user);
    return { access, refresh }
}

export default refresh;