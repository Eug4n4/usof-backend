import express from "express"
import { getByParameter } from "../utils/getByParameter.js";
import Comment from "../models/Comment.js";
import Like from "../models/Like.js";
import authMiddleware from "../auth/authMiddleware.js";
import { createLike, deleteComment, deleteLike } from "./comment.controller.js";
import { commentLikeValidator } from "../validators/like.validators.js";
import validationErrors from "../validators/validationErrorsMiddleware.js";

const commentsRouter = express.Router()

commentsRouter.get('/:comment_id', getByParameter('comment_id', Comment.getById))
commentsRouter.get('/:comment_id/like', getByParameter('comment_id', Like.getByCommentId))
commentsRouter.post('/:comment_id/like', authMiddleware, ...commentLikeValidator, validationErrors, createLike)
commentsRouter.delete('/:comment_id', authMiddleware, deleteComment)
commentsRouter.delete('/:comment_id/like', authMiddleware, deleteLike)

export default commentsRouter;
