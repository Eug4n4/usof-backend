import jwt from 'jsonwebtoken'
const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization
    if (!header) {
        res.status(403);
        res.json({ 'message': "Unauthorized" })
    } else {
        const token = header.split(' ')[1]
        if (!token) {
            res.status(403);
            res.json({ 'message': "Unauthorized" })
        } else {
            try {
                const tokenData = jwt.verify(token, process.env.JWT_SECRET)
                req.user = tokenData;
                next()
            } catch (e) {
                res.status(403);
                res.json({ 'message': "Unauthorized: " + e.message })
            }
        }
    }
}

export default authMiddleware;