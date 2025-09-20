import jwt from 'jsonwebtoken'

const getAuthUserData = (accessToken, refreshToken) => {
    if (accessToken && refreshToken) {
        try {
            const accessData = jwt.verify(accessToken, process.env.JWT_SECRET)
            jwt.verify(refreshToken, process.env.JWT_SECRET)
            return accessData;
        } catch (e) {
            return null;
        }
    }
    return null;
}

export default getAuthUserData