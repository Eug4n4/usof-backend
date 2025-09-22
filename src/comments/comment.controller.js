import { matchedData } from "express-validator";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";


const createLike = (req, res) => {
    const { type } = matchedData(req);
    const comment_id = req.params['comment_id'];
    new Like({ comment_id: comment_id, author: req.user.id, type: type }).save();
    res.status(201);
    res.json({ 'message': 'Like created' })
}

const deleteComment = async (req, res) => {
    const comment = await Comment.getByUserId(req.user['id'])
    if (comment) {
        comment.delete();
        res.json(comment)
    } else {
        res.status(403)
        res.json({ 'message': 'You are not allowed to delete this resource' })
    }
}

const deleteLike = async (req, res) => {
    const like = await Like.getByCommentUserId(req.params['comment_id'], req.user['id'])
    if (like) {
        like.delete();
        res.json(like)
    } else {
        res.status(403)
        res.json({ 'message': 'You are not allowed to delete this resource' })
    }
}

export { createLike, deleteComment, deleteLike }