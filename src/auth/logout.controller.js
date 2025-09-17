import Token from "../models/Token.js";

const logout = (req, res) => {
    const { access, refresh } = req.cookies;
    res.clearCookie('access')
    res.clearCookie('refresh')
    new Token().delete(refresh)
    res.json({ 'message': 'Logged out' })

}

export default logout;