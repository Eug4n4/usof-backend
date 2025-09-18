import jwt from 'jsonwebtoken'
const authMiddleware = (req, res, next) => {
    const { access, refresh } = req.cookies;
    if (access && refresh) {
        try {
            const accessData = jwt.verify(access, process.env.JWT_SECRET)
            jwt.verify(refresh, process.env.JWT_SECRET)
            req.user = accessData;
            next();
        } catch (e) {
            res.status(401)
            res.json({ 'message': "Unauthorized: " + e.message })
        }
    } else {
        res.status(401)
        res.json({ 'message': "Unauthorized" })
    }
}

export default authMiddleware;