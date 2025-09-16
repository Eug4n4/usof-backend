import express from "express";
import { createOne, getAll, getOne } from "./post.controller.js";
import { categoriesExists, contentExists, postValidator } from "../validators/post.validators.js";
import { getByParameter } from "../utils/getByParameter.js";
import Post from "../models/Post.js";

const postsRouter = express.Router();

postsRouter.get('/', getByParameter(undefined, Post.getAll))
postsRouter.get('/:post_id', getByParameter('post_id', Post.getById))
postsRouter.post('/', postValidator(), contentExists(), categoriesExists(), createOne)
export default postsRouter;
