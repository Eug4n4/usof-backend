import { body, matchedData } from "express-validator";
import Like from "../models/Like.js"


const likeExists = (method, paramName) => {
    return async (req, res, next) => {
        const { type } = matchedData(req);
        const parameter = req.params[paramName];
        const userId = req.user['id'];
        const like = await method(parameter, userId);
        if (like == null) {
            next()
        } else if (like.type != type) {
            await like.delete();
            next();
        } else {
            res.status(400);
            res.json({ 'message': 'You have already liked / disliked this' })
        }
    }
}

const postLikeValidator = [
    body('type').exists().isInt({ min: 0, max: 1 }),
    likeExists(Like.getByPostUserId, 'post_id')
]

const commentLikeValidator = [
    body('type').exists().isInt({ min: 0, max: 1 }),
    likeExists(Like.getByCommentUserId, 'comment_id')

]

export { postLikeValidator, commentLikeValidator };