import express from 'express';
import authRouter from './auth/router.js';
import postsRouter from './posts/router.js';
import categoryRouter from './categories/router.js';
import userRouter from './users/router.js';

const router = express.Router();




router.use('/users', userRouter)
router.use('/posts', postsRouter)
router.use('/categories', categoryRouter)
router.use('/auth', authRouter)
export default router;