import refresh from "../utils/refreshTokens.js";

const refreshToken = async (req, res) => {
    const token = req.cookies['refresh']
    try {
        const tokens = await refresh(token);
        res.cookie("access", tokens['access']['token'], { expires: new Date(tokens['access']['expires']) })
        res.cookie("refresh", tokens['refresh']['token'], { httpOnly: true, expires: new Date(tokens['refresh']['expires']) })
        res.json({});
    } catch (e) {
        res.status(401);
        res.json({ 'message': 'Unauthorized' });

    }
}

export default refreshToken;