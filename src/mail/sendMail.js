import transporter from "./transporter.js"
import jwt from 'jsonwebtoken'

const sendVerificationMail = (email) => {
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '30m' })
    transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Email verification",
        html: `<p>Please verify your email. Follow this <a href="http://localhost:8080/api/auth/verify/${token}">link</a></p>`
    })
}

export default sendVerificationMail