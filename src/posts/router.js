import express from "express";
import { createOne, getAll, getOne } from "./post.controller.js";
import { categoriesExists, contentExists, postValidator } from "../validators/post.validators.js";
import { getByParameter } from "../utils/getByParameter.js";
import Post from "../models/Post.js";
import authMiddleware from '../auth/authMiddleware.js'
import Comment from "../models/Comment.js";
import Category from "../models/Category.js";
import Like from "../models/Like.js";

const postsRouter = express.Router();

postsRouter.get('/', getByParameter(undefined, Post.getAll))
postsRouter.get('/:post_id', getByParameter('post_id', Post.getById))
postsRouter.get('/:post_id/comments', getByParameter('post_id', Comment.getByPostId))
postsRouter.get('/:post_id/categories', getByParameter('post_id', Category.getByPostId))
postsRouter.get('/:post_id/like', getByParameter('post_id', Like.getByPostId))
postsRouter.post('/', authMiddleware, postValidator(), contentExists(), categoriesExists(), createOne)
export default postsRouter;
