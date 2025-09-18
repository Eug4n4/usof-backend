import { matchedData, validationResult } from "express-validator";
import Post from "../models/Post.js";
import Category from "../models/Category.js";
import User from "../models/User.js"
import Like from "../models/Like.js";

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
    // const user = await User.findBy('id', req.user['id'])
    new Like({ post_id: postId, author: req.user.id, type: type }).save();
    res.json({ 'message': 'like created' })
}

export { getAll, getOne, createOne, createLike };