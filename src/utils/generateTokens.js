import jwt from 'jsonwebtoken'
import Token from '../models/Token.js'

const generateAccessToken = (user, expires) => {
    expires = Date.now() + expires;

    return {
        token: jwt.sign({ email: user['email'], role: user['role'] }, process.env.JWT_SECRET, { expiresIn: expires }),
        expires: expires
    }
}

const generateRefreshToken = (user, expires) => {
    expires = Date.now() + expires;
    return {
        token: jwt.sign({ email: user['email'] }, process.env.JWT_SECRET, { expiresIn: expires }),
        expires: expires
    }
}

const createTokenPair = (user, accessExpires, refreshExpires) => {
    const access = generateAccessToken(user, accessExpires);
    const refresh = generateRefreshToken(user, refreshExpires);
    new Token({ user_id: user['id'], refresh: refresh['token'] }).save()
    return { access, refresh }
}

export { generateAccessToken, generateRefreshToken, createTokenPair }