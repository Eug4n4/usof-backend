import jwt from 'jsonwebtoken'
import Token from '../models/Token.js'

const generateAccessToken = (user) => {
    const expires = Date.now() + 10 * 60 * 1000;

    return {
        token: jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: expires }),
        expires: expires
    }
}

const generateRefreshToken = (user) => {
    const expires = Date.now() + 2 * 60 * 60 * 1000;
    return {
        token: jwt.sign({ id: user['id'] }, process.env.JWT_SECRET, { expiresIn: expires }),
        expires: expires
    }
}

const createTokenPair = (user) => {
    const access = generateAccessToken(user);
    const refresh = generateRefreshToken(user);
    new Token({ user_id: user['id'], refresh: refresh['token'] }).save()
    return { access, refresh }
}

export { generateAccessToken, generateRefreshToken, createTokenPair }