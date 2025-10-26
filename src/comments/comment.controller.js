import { matchedData } from "express-validator";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import CommentDto from "../dto/CommentDto.js";


const getOne = async (req, res) => {
    const comment_id = req.params['comment_id'];
    const comment = await Comment.getById(comment_id);
    if (comment) {
        const dto = await CommentDto.createInstance(comment)
        return res.json(dto)
    }
    return res.status(404).json({ "message": "I cant find this" })

}

const createLike = (req, res) => {
    const { type } = matchedData(req);
    const comment_id = req.params['comment_id'];
    new Like({ comment_id: comment_id, author: req.user.id, type: type }).save();
    res.status(201);
    if (type == 1) {
        res.json({ 'message': 'Like created' })
    } else {
        res.json({ 'message': 'Dislike created' })
    }
}

const deleteComment = async (req, res) => {
    const comment = await Comment.getByCommentUserId(req.params['comment_id'], req.user['id'])
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

const updateComment = async (req, res) => {
    let comment;
    const { active } = matchedData(req);
    const id = req.params['comment_id'];
    if (req.user['role'] === 'admin') {
        comment = await Comment.getById(id)
        if (!comment) {
            res.status(403);
            res.json({ 'message': 'You are not allowed to update this resource' })
            return;
        }
    } else {
        comment = await Comment.getByCommentUserId(id, req.user['id'])
        if (!comment) {
            res.status(403);
            res.json({ 'message': 'You are not allowed to update this resource' })
            return;
        }
    }
    comment.is_active = active;
    await comment.save()
    const dto = await CommentDto.createInstance(comment)
    res.json(dto);
}

export { getOne, createLike, deleteComment, deleteLike, updateComment }