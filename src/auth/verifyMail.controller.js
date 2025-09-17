import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const verifyMail = async (req, res) => {
    const token = req.params.token
    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findBy('email', tokenData.email)
        if (user) {
            user.is_active = true;
            user.save()
            res.json({ 'message': 'Email has been successfully verified' })
        } else {
            res.status(400)
            res.json({ 'message': 'There is no user with this email' })
        }
    } catch (e) {
        res.status(400)
        res.json({ 'message': 'Verification link has expired' })
    }
}

export default verifyMail;