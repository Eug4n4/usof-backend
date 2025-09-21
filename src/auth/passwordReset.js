import { matchedData } from "express-validator"
import { sendPasswordResetMail } from "../mail/sendMail.js";
import jwt from "jsonwebtoken"
import User from "../models/User.js";
import hash_password from "../utils/hash_password.js";
const confirmReset = async (req, res) => {
    const token = req.params['confirm_token'];
    const newPassword = matchedData(req)['new_password']
    try {
        const userData = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findBy('email', userData['email'])
        if (user) {
            const hashed = await hash_password(newPassword);
            user.password = hashed;
            user.save();
            res.json({ 'message': 'Password reset successfully' })
        } else {
            res.status(400)
            res.json({ 'message': 'There is no user with provided credentials' })
        }
    } catch (e) {
        res.status(400)
        res.json({ 'message': e.message })
    }
}

const reset = (req, res) => {
    const email = matchedData(req)['email'];
    sendPasswordResetMail(email)
    res.json({ 'message': `Email was sent to ${email}` })
}

export { reset, confirmReset }