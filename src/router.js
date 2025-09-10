import express from 'express';
import User from './models/User.js'
import Post from './models/Post.js';
import Category from './models/Category.js';

const router = express.Router();

router.get('/users', async (req, res) => {
    const result = await User.getAll();
    res.json(result);
})

router.get('/posts', async (req, res) => {
    const result = await Post.getAll();
    res.json(result);
})

router.get('/categories', async (req, res) => {
    const result = await Category.getAll();
    res.json(result);
})

export default router;