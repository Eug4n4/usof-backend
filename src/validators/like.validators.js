import { body } from "express-validator";
import Like from "../models/Like.js"


const likeExists = async (req, res, next) => {
    const postId = req.params['post_id'];
    const userId = req.user['id'];
    const like = await Like.getByPostUserId(postId, userId);
    if (like == null) {
        next()
    } else {
        res.status(400);
        res.json({ 'message': 'You have already liked this post' })
    }
}

const likeValidator = [
    body('type').exists().isInt({ min: 0, max: 1 }),
    likeExists
]

export default likeValidator;