import express from "express";
import Post from "../models/Post.js";

const postsRouter = express.Router();

postsRouter.get('/', async (req, res) => {
    const result = await Post.getAll();
    res.json(result);
})

export default postsRouter;
