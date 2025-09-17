import express from "express"
import { getByParameter } from "../utils/getByParameter.js";
import Comment from "../models/Comment.js";
import Like from "../models/Like.js";

const commentsRouter = express.Router()

commentsRouter.get('/:comment_id', getByParameter('comment_id', Comment.getById))
commentsRouter.get('/:comment_id/like', getByParameter('comment_id', Like.getByCommentId))


export default commentsRouter;
