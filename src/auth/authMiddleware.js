import getAuthUserData from './getAuthUserData.js';
const authMiddleware = (req, res, next) => {
    const { access, refresh } = req.cookies;
    const userData = getAuthUserData(access, refresh);
    if (userData) {
        req.user = userData;
        next();
    } else {
        res.status(401)
        res.json({ 'message': "Unauthorized" })
    }
}

export default authMiddleware;