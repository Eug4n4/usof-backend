import transporter from "./transporter.js"
import jwt from 'jsonwebtoken'

const sendVerificationMail = (email) => {
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '30m' })
    const link = `${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/api/auth/verify/${token}`
    transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Email verification",
        html: `<p>Please verify your email. Follow this <a href="${link}">link</a></p>`
    })
}

const sendPasswordResetMail = (email) => {
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '30m' })
    const link = `${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}/password-reset/${token}`
    transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Password reset",
        html: `<p>Follow this link to reset your password. Link expires in 30 minutes</p>\n\
        <p><a href="${link}">link</a></p>`
    })
}

export { sendVerificationMail, sendPasswordResetMail }