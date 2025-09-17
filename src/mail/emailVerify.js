import { generateRefreshToken } from "../utils/generateTokens.js"
import transporter from "./transporter.js"


const sendVerificationMail = (email) => {
    const token = generateRefreshToken({ email: email }, 10 * 60 * 1000)
    transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Email verification",
        html: `<p>Please verify your email. Follow this <a href="http://localhost:8080/api/auth/verify/${token['token']}">link</a></p>`
    })
}

export default sendVerificationMail