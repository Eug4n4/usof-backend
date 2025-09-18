import { matchedData, validationResult } from "express-validator";
import Post from "../models/Post.js";
import Category from "../models/Category.js";
import User from "../models/User.js"
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";

const getAll = async (req, res) => {
    const result = await Post.getAll();
    res.json(result);
}

const getOne = async (req, res) => {
    const id = Number.parseInt(req.params['post_id']);
    if (id) {
        const result = await Post.getById(id);
        res.json(result);
    } else {
        res.status(400);
        res.json({ 'message': 'Provide correct post_id' });
    }
}

const createOne = async (req, res) => {
    const { title, content, categories } = matchedData(req);
    const createdCategories = await Category.getByNames(categories);
    const { id } = await User.findBy('id', req.user['id']);
    if (createdCategories.length === categories.length) {
        const newPost = new Post({ author: id, title, content });
        newPost.save().then(() => {
            newPost.setCategories(createdCategories)
        })
        res.json(newPost);
    } else {
        res.status(400);
        res.json({ 'message': 'Some category didn\'t exist' })
    }

}

const createLike = async (req, res) => {
    const { type } = matchedData(req);
    const postId = req.params['post_id'];
    new Like({ post_id: postId, author: req.user.id, type: type }).save();
    res.status(201);
    res.json({ 'message': 'like created' })
}

const createComment = async (req, res) => {
    const { content } = matchedData(req);
    const postId = req.params['post_id'];
    new Comment({ author: req.user.id, post_id: postId, content: content }).save();
    res.status(201);
    res.json({ 'message': 'comment created' })

}

export { getAll, getOne, createOne, createLike, createComment };