import Token from "../models/Token.js";

const logout = (req, res) => {
    const { refresh } = req.cookies;
    res.clearCookie('access')
    res.clearCookie('refresh')
    new Token({ refresh: refresh }).delete()
    res.json({ 'message': 'Logged out' })

}

export default logout;