import express from "express";
import { createComment, createLike, createOne, getAll, getOne } from "./post.controller.js";
import { postValidator } from "../validators/post.validators.js";
import { getByParameter } from "../utils/getByParameter.js";
import Post from "../models/Post.js";
import authMiddleware from '../auth/authMiddleware.js'
import Comment from "../models/Comment.js";
import Category from "../models/Category.js";
import Like from "../models/Like.js";
import validationErrors from "../validators/validationErrorsMiddleware.js";
import { postLikeValidator } from "../validators/like.validators.js";
import commentValidator from "../validators/comment.validators.js";
import queryValidator from "../validators/query.validators.js";

const postsRouter = express.Router();

postsRouter.get('/', ...queryValidator, validationErrors, getAll)
postsRouter.get('/:post_id', getByParameter('post_id', Post.getById))
postsRouter.get('/:post_id/comments', getByParameter('post_id', Comment.getByPostId))
postsRouter.get('/:post_id/categories', getByParameter('post_id', Category.getByPostId))
postsRouter.get('/:post_id/like', getByParameter('post_id', Like.getByPostId))
postsRouter.post('/', authMiddleware, ...postValidator, validationErrors, createOne)
postsRouter.post('/:post_id/like', authMiddleware, ...postLikeValidator, validationErrors, createLike)
postsRouter.post('/:post_id/comment', authMiddleware, ...commentValidator, validationErrors, createComment)

export default postsRouter;
