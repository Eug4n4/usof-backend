import express from 'express';
import User from './models/User.js'
import authRouter from './auth/router.js';
import postsRouter from './posts/router.js';
import categoryRouter from './categories/router.js';

const router = express.Router();

router.get('/users', async (req, res) => {
    const result = await User.getAll();
    res.json(result);
})



router.use('/posts', postsRouter)
router.use('/categories', categoryRouter)
router.use('/auth', authRouter)
export default router;